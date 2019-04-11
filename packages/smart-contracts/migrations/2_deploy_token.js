/* global artifacts */

const Token = artifacts.require('Token')

module.exports = deployer => {
  deployer.deploy(Token)
}
