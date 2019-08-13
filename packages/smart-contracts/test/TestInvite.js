const Token = artifacts.require('Token.sol')
const ContactInvite = artifacts.require('ContactInvite.sol')
const EthUtil = require('ethereumjs-util')
const ethers = require('ethers')
const truffleAssert = require('truffle-assertions')

// Ganache mnemonic:
// canyon shaft mirror vital twin father surprise live nasty grain awesome boring

const senderFeed =
  '09bab720214dce6dee41c53144bb955d107d8415def419b6582422f495586f38'
const senderFeedHash = EthUtil.keccak(senderFeed)
const recipientFeed =
  '9a97a59bf7d46574c5907daeb07e9f70965e7e102fe016fdf0631d627c89a9b4'
const recipientFeedHash = EthUtil.keccak(recipientFeed)
const recipient2Feed =
  '9a97a59bf7d46574c5907daeb07e9f70965e7e102fe016fdf0631d627c89a9b4'
const recipient2FeedHash = EthUtil.keccak(recipient2Feed)
const acc1PrivateKey =
  '1c5a7303b5ecbb14a38753aeffeb70a7794a475b84de472077e25b5fa3e9ae56'

contract('ContactInvite', accounts => {
  let token
  let invites
  const accountHashes = accounts.map(a => EthUtil.keccak(a))

  beforeEach('setup contract for each test', async () => {
    token = await Token.new()
    invites = await ContactInvite.new(token.address)
  })

  it('Should allow sending invites with recipient data in events', async () => {
    const bnStake = await invites.requiredStake()
    const stake = bnStake.toString()

    let inviteState = await invites.getInviteState(
      accountHashes[0],
      senderFeedHash,
      accountHashes[1],
      recipientFeedHash,
    )

    assert.equal(web3.utils.toUtf8(inviteState), 'NONE', 'Invalid invite state')

    await token.approve(invites.address, stake, {
      from: accounts[0],
    })
    const res = await invites.sendInvite(
      accountHashes[1],
      recipientFeedHash,
      senderFeed,
      {
        from: accounts[0],
      },
    )

    inviteState = await invites.getInviteState(
      accountHashes[0],
      senderFeedHash,
      accountHashes[1],
      recipientFeedHash,
    )

    assert.equal(
      web3.utils.toUtf8(inviteState),
      'PENDING',
      'Invalid invite state',
    )

    truffleAssert.eventEmitted(res, 'Invited', ev => {
      return (
        ev.recipientFeedHash === EthUtil.bufferToHex(recipientFeedHash) &&
        ev.recipientAddressHash === EthUtil.bufferToHex(accountHashes[1]) &&
        ev.senderFeed === senderFeed
      )
    })
  })

  it('Should fail to retrieve stake when submitting invalid siganture', async () => {
    const bnStake = await invites.requiredStake()
    const stake = bnStake.toString()
    await token.approve(invites.address, stake, {
      from: accounts[0],
    })
    await web3.eth.sendTransaction({
      to: '0x158bc802c0bc93abc96d1619b0e476c205275375',
      from: accounts[0],
      value: web3.utils.toWei('1'),
    })
    await token.transfer('0x158bc802c0bc93abc96d1619b0e476c205275375', stake, {
      from: accounts[0],
    })

    await invites.sendInvite(accountHashes[1], recipientFeedHash, senderFeed, {
      from: accounts[0],
    })

    const messageBytes = EthUtil.toBuffer('fail')
    const msgHash = EthUtil.hashPersonalMessage(messageBytes)
    const signature = EthUtil.ecsign(msgHash, new Buffer(acc1PrivateKey, 'hex'))

    await truffleAssert.fails(
      invites.retrieveStake(
        accountHashes[1],
        recipientFeedHash,
        senderFeedHash,
        signature.v,
        signature.r,
        signature.s,
        {
          from: accounts[0],
        },
      ),
      truffleAssert.ErrorType.REVERT,
    )
  })

  it('Should allow sender to withdraw stake once invite accepted', async () => {
    const bnStake = await invites.requiredStake()
    const stake = bnStake.toString()
    await token.approve(invites.address, stake, {
      from: accounts[0],
    })
    await invites.sendInvite(accountHashes[1], recipientFeedHash, senderFeed, {
      from: accounts[0],
    })

    let inviteState = await invites.getInviteState(
      accountHashes[0],
      senderFeedHash,
      accountHashes[1],
      recipientFeedHash,
    )

    assert.equal(
      web3.utils.toUtf8(inviteState),
      'PENDING',
      'Invalid invite state',
    )

    const messageBytes = Buffer.concat([
      EthUtil.toBuffer('MFOS Contact Accept:'),
      accountHashes[0],
    ])
    console.log('message bytes', messageBytes, messageBytes.length)
    const msgHash = EthUtil.hashPersonalMessage(messageBytes)
    const signature = EthUtil.ecsign(msgHash, new Buffer(acc1PrivateKey, 'hex'))
    console.log('msgHash: ', msgHash)

    console.log('signature: ', signature)

    const res = await invites.retrieveStake(
      accountHashes[1],
      recipientFeedHash,
      senderFeedHash,
      signature.v,
      signature.r,
      signature.s,
      {
        from: accounts[0],
      },
    )

    inviteState = await invites.getInviteState(
      accountHashes[0],
      senderFeedHash,
      accountHashes[1],
      recipientFeedHash,
    )

    const pendingStake = await invites.pendingInviteStake(
      accountHashes[0],
      senderFeedHash,
      accountHashes[1],
      recipientFeedHash,
    )

    assert.equal(
      pendingStake.toString(),
      '0',
      'Still have a pending stake after withdrawal',
    )

    const stateString = web3.utils.toUtf8(inviteState)
    assert.equal(stateString, 'ACCEPTED', 'Invalid invite state')

    truffleAssert.eventEmitted(res, 'StakeRetrieved', ev => {
      return (
        ev.senderAddress === accounts[0] &&
        ev.recipientFeedHash === EthUtil.bufferToHex(recipientFeedHash)
      )
    })
  })

  it('Should fail when trying to send duplicate invitation', async () => {
    const bnStake = await invites.requiredStake()
    const stake = bnStake.toString()
    await token.approve(invites.address, stake, {
      from: accounts[0],
    })
    await invites.sendInvite(accountHashes[1], recipientFeedHash, senderFeed, {
      from: accounts[0],
    })

    await truffleAssert.fails(
      invites.sendInvite(accountHashes[1], recipientFeedHash, senderFeed, {
        from: accounts[0],
      }),
      truffleAssert.ErrorType.REVERT,
    )
  })

  it('Should allow recipient to reject invite and withdraw stake', async () => {
    const bnStake = await invites.requiredStake()
    const stake = bnStake.toString()
    await token.approve(invites.address, stake, {
      from: accounts[0],
    })
    await invites.sendInvite(accountHashes[1], recipientFeedHash, senderFeed, {
      from: accounts[0],
    })

    let pendingStake = await invites.pendingInviteStake(
      accountHashes[0],
      senderFeedHash,
      accountHashes[1],
      recipientFeedHash,
    )

    assert.equal(
      pendingStake.toString(),
      stake,
      'Incorrect pending stake for invite',
    )

    const res = await invites.declineAndWithdraw(
      accountHashes[0],
      senderFeedHash,
      recipientFeedHash,
      {
        from: accounts[1],
      },
    )

    pendingStake = await invites.pendingInviteStake(
      accountHashes[0],
      senderFeedHash,
      accountHashes[1],
      recipientFeedHash,
    )

    assert.equal(
      pendingStake.toString(),
      '0',
      'Still have a pending stake after withdrawal',
    )

    const inviteState = await invites.getInviteState(
      accountHashes[0],
      senderFeedHash,
      accountHashes[1],
      recipientFeedHash,
    )

    const stateString = web3.utils.toUtf8(inviteState)
    assert.equal(stateString, 'REJECTED', 'Invalid invite state')

    truffleAssert.eventEmitted(res, 'Declined', ev => {
      return ev.senderFeedHash === EthUtil.bufferToHex(senderFeedHash)
    })
  })

  it('Should allow refunds by contract owner', async () => {
    const bnStake = await invites.requiredStake()
    const stake = bnStake.toString()
    await token.approve(invites.address, stake, {
      from: accounts[0],
    })
    await invites.sendInvite(accountHashes[1], recipientFeedHash, senderFeed, {
      from: accounts[0],
    })

    const res = await invites.adminRefund(
      accountHashes[0],
      senderFeedHash,
      accountHashes[1],
      recipientFeedHash,
      {
        from: accounts[0],
      },
    )

    const pendingStake = await invites.pendingInviteStake(
      accountHashes[0],
      senderFeedHash,
      accountHashes[1],
      recipientFeedHash,
    )

    assert.equal(
      pendingStake.toString(),
      '0',
      'Still have a pending stake after withdrawal',
    )

    const inviteState = await invites.getInviteState(
      accountHashes[0],
      senderFeedHash,
      accountHashes[1],
      recipientFeedHash,
    )

    const stateString = web3.utils.toUtf8(inviteState)
    assert.equal(stateString, 'NONE', 'Invalid invite state')

    truffleAssert.eventEmitted(res, 'AdminRefunded', ev => {
      return ev.senderAddress === accounts[0]
    })
  })

  it('Should fail when attempting to refund stake by non owner', async () => {
    const bnStake = await invites.requiredStake()
    const stake = bnStake.toString()
    await token.approve(invites.address, stake, {
      from: accounts[0],
    })
    await invites.sendInvite(accountHashes[1], recipientFeedHash, senderFeed, {
      from: accounts[0],
    })

    await truffleAssert.fails(
      invites.adminRefund(
        accountHashes[0],
        senderFeedHash,
        accountHashes[1],
        recipientFeedHash,
        {
          from: accounts[2],
        },
      ),
      truffleAssert.ErrorType.REVERT,
    )
  })

  it('Should disable user interaction when paused', async () => {
    const bnStake = await invites.requiredStake()
    const stake = (2 * bnStake).toString()
    await token.approve(invites.address, stake, {
      from: accounts[0],
    })
    await invites.sendInvite(accountHashes[1], recipientFeedHash, senderFeed, {
      from: accounts[0],
    })

    const messageBytes = Buffer.concat([
      EthUtil.toBuffer('MFOS Contact Accept:'),
      accountHashes[0],
    ])
    const msgHash = EthUtil.hashPersonalMessage(messageBytes)
    const signature = EthUtil.ecsign(msgHash, new Buffer(acc1PrivateKey, 'hex'))

    await invites.pause({ from: accounts[0] })

    await truffleAssert.fails(
      invites.retrieveStake(
        accountHashes[1],
        recipientFeedHash,
        senderFeedHash,
        signature.v,
        signature.r,
        signature.s,
        {
          from: accounts[0],
        },
      ),
      truffleAssert.ErrorType.REVERT,
    )

    await truffleAssert.fails(
      invites.declineAndWithdraw(
        accountHashes[0],
        senderFeedHash,
        recipientFeedHash,
        {
          from: accounts[1],
        },
      ),
      truffleAssert.ErrorType.REVERT,
    )

    await truffleAssert.fails(
      invites.sendInvite(accountHashes[2], recipient2FeedHash, senderFeed, {
        from: accounts[0],
      }),
      truffleAssert.ErrorType.REVERT,
    )

    await invites.unpause({ from: accounts[0] })

    await invites.retrieveStake(
      accountHashes[1],
      recipientFeedHash,
      senderFeedHash,
      signature.v,
      signature.r,
      signature.s,
      {
        from: accounts[0],
      },
    )

    const inviteState = await invites.getInviteState(
      accountHashes[0],
      senderFeedHash,
      accountHashes[1],
      recipientFeedHash,
    )

    const stateString = web3.utils.toUtf8(inviteState)
    assert.equal(stateString, 'ACCEPTED', 'Invalid invite state')
  })

  it('Should allow changes to the staking amount', async () => {
    const bnStake = await invites.requiredStake()
    const stake = bnStake.toString()
    await token.approve(invites.address, stake, {
      from: accounts[0],
    })
    await invites.sendInvite(accountHashes[1], recipientFeedHash, senderFeed, {
      from: accounts[0],
    })

    await truffleAssert.fails(
      invites.setStake(ethers.utils.parseEther('1000'), { from: accounts[1] }),
      truffleAssert.ErrorType.REVERT,
    )
    const res = await invites.setStake(ethers.utils.parseEther('1000'), {
      from: accounts[0],
    })

    truffleAssert.eventEmitted(res, 'StakeChanged', ev => {
      return (
        ev.oldStake.toString() === ethers.utils.parseEther('100').toString() &&
        ev.newStake.toString() === ethers.utils.parseEther('1000').toString()
      )
    })

    const bnStake2 = await invites.requiredStake()
    const stake2 = bnStake2.toString()

    assert.notEqual(bnStake, bnStake2, 'Stake did not change')

    await token.approve(invites.address, stake2, {
      from: accounts[0],
    })
    await invites.sendInvite(accountHashes[2], recipient2FeedHash, senderFeed, {
      from: accounts[0],
    })

    const pendingStake = await invites.pendingInviteStake(
      accountHashes[0],
      senderFeedHash,
      accountHashes[1],
      recipientFeedHash,
    )

    assert.equal(
      ethers.utils.formatEther(pendingStake.toString()),
      '100.0',
      'Incorrect staked value',
    )

    const pendingStake2 = await invites.pendingInviteStake(
      accountHashes[0],
      senderFeedHash,
      accountHashes[2],
      recipient2FeedHash,
    )

    assert.equal(
      ethers.utils.formatEther(pendingStake2.toString()),
      '1000.0',
      'Incorrect staked value',
    )
  })
})
