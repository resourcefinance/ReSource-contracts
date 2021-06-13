import "hardhat-jest-plugin"
import "@nomiclabs/hardhat-waffle"
import "@nomiclabs/hardhat-ethers"

import "@typechain/hardhat"
import { HardhatUserConfig } from "hardhat/types"
import "@openzeppelin/hardhat-upgrades"

require("@nomiclabs/hardhat-ethers")
require("./tasks/test")
require("./tasks/getAddress")

enum chainIds {
  mainnet = 42220,
  dev = 1337, // TODO: docker container uses 1337, but I thought it was supposed to be set to 1101 in snapshot?
  baklava = 62320,
  hardhat = 31337,
  testnet = 44787,
}

const config: HardhatUserConfig = {
  defaultNetwork: "testnet",
  networks: {
    mainnet: {
      url: "https://forno.celo.org",
      chainId: chainIds.mainnet,
    },
    testnet: {
      url: "https://alfajores-forno.celo-testnet.org",
      chainId: chainIds.testnet,
      accounts: ["590a1d9cfea40247fd90bb2f5802ea158906bdfc52986f0e1fa9b7f32416b72c"],
    },
    dev: {
      url: "http://localhost:8545",
      chainId: chainIds.dev,
    },
    hardhat: {
      chainId: chainIds.dev,
    },
  },
  solidity: {
    compilers: [
      { version: "0.8.0", settings: {} },
      {
        version: "0.5.13",
        settings: {
          evmVersion: "istanbul",
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./__tests__",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  typechain: {
    outDir: "./types",
    target: "ethers-v5",
    alwaysGenerateOverloads: true,
  },
}

export default config
