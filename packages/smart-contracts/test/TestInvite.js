/* global artifacts contract assert web3 invites */

const Token = artifacts.require('Token.sol')
const ContactInvite = artifacts.require('ContactInvite.sol')
const EthUtil = require('ethereumjs-util')
const ethers = require('ethers')
const truffleAssert = require('truffle-assertions')

// Ganache mnemonic:
// canyon shaft mirror vital twin father surprise live nasty grain awesome boring

const senderFeed =
  '09bab720214dce6dee41c53144bb955d107d8415def419b6582422f495586f38'
const recipientFeed =
  '9a97a59bf7d46574c5907daeb07e9f70965e7e102fe016fdf0631d627c89a9b4'
const acc1PrivateKey =
  '1c5a7303b5ecbb14a38753aeffeb70a7794a475b84de472077e25b5fa3e9ae56'

contract('Token', accounts => {
  let token

  beforeEach('setup contract for each test', async () => {
    token = await Token.new()
    invites = await ContactInvite.new(token.address)
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
      value: stake,
    })
    await token.transfer('0x158bc802c0bc93abc96d1619b0e476c205275375', stake, {
      from: accounts[0],
    })

    await invites.sendInvite(accounts[1], recipientFeed, senderFeed, {
      from: accounts[0],
    })

    const invalidMessageHash = EthUtil.keccak('fail')
    const invalidHashBytes = ethers.utils.arrayify(invalidMessageHash)

    const msgHash = EthUtil.hashPersonalMessage(invalidHashBytes)
    const signature = EthUtil.ecsign(msgHash, new Buffer(acc1PrivateKey, 'hex'))

    await truffleAssert.fails(
      invites.retrieveStake(
        accounts[1],
        recipientFeed,
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
    await invites.sendInvite(accounts[1], recipientFeed, senderFeed, {
      from: accounts[0],
    })

    console.log('token.address: ', token.address)
    console.log('invites.address: ', invites.address)

    const messagetoSign = accounts[0]
    const messageHash = EthUtil.keccak(messagetoSign)

    // To have a consistent message hash with the one generated on chain
    // we must convert the 66 byte string to it's 32 byte binary Array

    const messageHashBytes = ethers.utils.arrayify(messageHash)
    const msgHash = EthUtil.hashPersonalMessage(messageHashBytes)
    const signature = EthUtil.ecsign(msgHash, new Buffer(acc1PrivateKey, 'hex'))

    const res = await invites.retrieveStake(
      accounts[1],
      recipientFeed,
      signature.v,
      signature.r,
      signature.s,
      {
        from: accounts[0],
      },
    )

    const inviteState = await invites.getInviteState(
      accounts[0],
      accounts[1],
      recipientFeed,
      { from: accounts[0] },
    )

    const pendingStake = await invites.pendingInviteStake(
      accounts[0],
      accounts[1],
      recipientFeed,
    )

    assert.equal(
      pendingStake.toString(),
      '0',
      'Still have a pending stake after withdrawal',
    )

    const stateString = web3.utils.toUtf8(inviteState)
    assert.equal(stateString, 'ACCEPTED', 'Invalid invite state')

    truffleAssert.eventEmitted(res, 'StakeRetrieved', ev => {
      return ev.sender === accounts[0] && ev.recipient === accounts[1]
    })
  })

  it('Should fail when trying to send duplicate invitation', async () => {
    const bnStake = await invites.requiredStake()
    const stake = bnStake.toString()
    await token.approve(invites.address, stake, {
      from: accounts[0],
    })
    await invites.sendInvite(accounts[1], recipientFeed, senderFeed, {
      from: accounts[0],
    })

    await truffleAssert.fails(
      invites.sendInvite(accounts[1], recipientFeed, senderFeed, {
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
    await invites.sendInvite(accounts[1], recipientFeed, senderFeed, {
      from: accounts[0],
    })

    let pendingStake = await invites.pendingInviteStake(
      accounts[0],
      accounts[1],
      recipientFeed,
    )

    assert.equal(
      pendingStake.toString(),
      stake,
      'Incorrect pending stake for invite',
    )

    const res = await invites.declineAndWithdraw(
      accounts[0],
      senderFeed,
      recipientFeed,
      {
        from: accounts[1],
      },
    )

    pendingStake = await invites.pendingInviteStake(
      accounts[0],
      accounts[1],
      recipientFeed,
    )

    assert.equal(
      pendingStake.toString(),
      '0',
      'Still have a pending stake after withdrawal',
    )

    const inviteState = await invites.getInviteState(
      accounts[0],
      accounts[1],
      recipientFeed,
      { from: accounts[0] },
    )

    const stateString = web3.utils.toUtf8(inviteState)
    assert.equal(stateString, 'REJECTED', 'Invalid invite state')

    truffleAssert.eventEmitted(res, 'Declined', ev => {
      return ev.senderAddress === accounts[0]
    })
  })

  it('Should allow refunds by contract owner', async () => {
    const bnStake = await invites.requiredStake()
    const stake = bnStake.toString()
    await token.approve(invites.address, stake, {
      from: accounts[0],
    })
    await invites.sendInvite(accounts[1], recipientFeed, senderFeed, {
      from: accounts[0],
    })

    const res = await invites.adminRefund(
      accounts[0],
      accounts[1],
      recipientFeed,
      {
        from: accounts[0],
      },
    )

    const pendingStake = await invites.pendingInviteStake(
      accounts[0],
      accounts[1],
      recipientFeed,
    )

    assert.equal(
      pendingStake.toString(),
      '0',
      'Still have a pending stake after withdrawal',
    )

    const inviteState = await invites.getInviteState(
      accounts[0],
      accounts[1],
      recipientFeed,
      { from: accounts[0] },
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
    await invites.sendInvite(accounts[1], recipientFeed, senderFeed, {
      from: accounts[0],
    })

    await truffleAssert.fails(
      invites.adminRefund(accounts[0], accounts[1], recipientFeed, {
        from: accounts[2],
      }),
      truffleAssert.ErrorType.REVERT,
    )
  })
})
