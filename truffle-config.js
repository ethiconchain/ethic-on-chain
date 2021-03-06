const path = require("path");
require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 7545,            // Standard Ethereum port (default: none)
      network_id: "5777",       // Any network (default: none)
      gas: 6721975,
    },
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(`${process.env.MNEMONIC}`, `https://rinkeby.infura.io/v3/${process.env.IDINFURA}`)
      },
      network_id: 4,
    },
    ropsten: {
      provider: () =>
        new HDWalletProvider({
          mnemonic: `${process.env.MNEMONIC}`,
          providerOrUrl: `https://ropsten.infura.io/v3/${process.env.INFURAID}`,
          // numberOfAddresses: 1,
          addressIndex: 0
        }),
      network_id: 3,
    },
    kovan: {
      provider: function () {
        return new HDWalletProvider(`${process.env.MNEMONIC}`, `https://kovan.infura.io/v3/${process.env.IDINFURA}`)
      },
      network_id: 42
    },    
    matic: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, 
      `https://polygon-mumbai.infura.io/v3/4c2aef8f0b8d4b19b85e3bef915da9ba`),
      network_id: 80001,
      networkCheckTimeout: 10000, 
      networkCheckTimeout: 5000,
      timeoutBlocks: 5000,
      skipDryRun: true
    }
  },
  compilers: {
    solc: {
      version: "0.8.11", // Récupérer la version exacte de solc-bin (par défaut : la  version de truffle)
      settings: {  // Voir les documents de solidity pour des conseils sur l'optimisation et l'evmVersion
        optimizer: {
          enabled: false,
          runs: 20
        },
      }
    },
  },

};
