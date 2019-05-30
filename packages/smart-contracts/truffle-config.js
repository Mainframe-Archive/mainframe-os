/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * truffleframework.com/docs/advanced/configuration
 *
 * To deploy via Infura you'll need a wallet provider (like truffle-hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura API
 * keys are available for free at: infura.io/register
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 *
 */

const HDWalletProvider = require('truffle-hdwallet-provider')
const mnemonic = process.env.MNEMONIC

module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */

  networks: {
    // To test in development run ganachi and inject mnemonic:
    // ganache-cli -m="canyon shaft mirror vital twin father surprise live nasty grain awesome boring"

    development: {
      host: '127.0.0.1', // Localhost (default: none)
      port: 8545, // Standard Ethereum port (default: none)
      network_id: '*', // Any network (default: none)
    },

    ropsten: {
      network_id: '3',
      provider: function() {
        return new HDWalletProvider(
          mnemonic,
          'https://ropsten.infura.io/v3/8ec0911ee74c4583b1346bbc1afdf22d',
        )
      },
      gasPrice: 5000000000,
      // gas: 8500000,           // Gas sent with each transaction (default: ~6700000)
    },
    mainnet: {
      network_id: '1',
      provider: function() {
        return new HDWalletProvider(
          mnemonic,
          'https://mainnet.infura.io/v3/8ec0911ee74c4583b1346bbc1afdf22d',
        )
      },
      gasPrice: 5000000000,
    },
  },

  mocha: {
    timeout: 100000,
  },

  // Configure your compilers

  compilers: {
    solc: {
      version: '0.5.2', // Fetch exact version from solc-bin (default: truffle's version)
    },
  },
}
