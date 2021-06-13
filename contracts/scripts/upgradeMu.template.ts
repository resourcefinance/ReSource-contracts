// Be sure to read this documentation before creating new upgrades https://docs.openzeppelin.com/learn/upgrading-smart-contracts?pref=hardhat

const hre = require("hardhat")
const { upgrades } = require("hardhat")
import { CeloProvider } from "@celo-tools/celo-ethers-wrapper"

const muAddress = "0xBcd563AB005b5Fa59E26F9C799B73a48C4f4184E"

async function main() {
  const connectionInfo = hre.config.networks.dev
  const provider = new CeloProvider(connectionInfo.url)
  await provider.ready

  const MutualityTokenV2 = await hre.ethers.getContractFactory("MutualityToken_V2")

  const mutualityToken = await upgrades.upgradeProxy(muAddress, MutualityTokenV2)
  await mutualityToken.deployed()
  console.log("mutuality deployed to:", mutualityToken.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
