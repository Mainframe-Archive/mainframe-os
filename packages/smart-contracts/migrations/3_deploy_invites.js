/* global artifacts */

const ContactInvite = artifacts.require('ContactInvite')
const Token = artifacts.require('Token')

module.exports = (deployer, network) => {
  let address
  switch (network) {
    case 'mainnet':
      address = '0xdf2c7238198ad8b389666574f2d8bc411a4b7428'
      break
    case 'ropsten':
      address = '0xa46f1563984209fe47f8236f8b01a03f03f957e4'
      break
    default:
      address = Token.address
  }
  deployer.deploy(ContactInvite, address)
}
