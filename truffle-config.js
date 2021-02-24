const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonicPhrase = "mountains supernatural bird ...";

module.exports = {
  plugins: ["solidity-coverage"],
  networks: {
    development: {
      host: "localhost",
      port: 7545,
      network_id: "*",
      gas: 12000000,
    },
    test: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "1101",
      provider: () =>
          new HDWalletProvider({
            mnemonic: {
              phrase: mnemonicPhrase
            },
            providerOrUrl: "https://ropsten.infura.io/v3/YOUR-PROJECT-ID",
            numberOfAddresses: 1,
            shareNonce: true,
            derivationPath: "m/44'/1'/0'/0/"
          }),
      gas: 12000000,
    }
  },
  compilers: {
    solc: {
      version: "0.7.1",
      settings: {
        optimizer: {
          enabled: true,
          runs: 10000,
        },
      },
    },
  },
};
