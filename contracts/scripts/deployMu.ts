const hre = require("hardhat")
const { upgrades } = require("hardhat")
import { CeloProvider } from "@celo-tools/celo-ethers-wrapper"

async function main() {
  const connectionInfo = hre.config.networks.dev
  const provider = new CeloProvider(connectionInfo.url)
  await provider.ready

  const MutualityToken = await hre.ethers.getContractFactory("MutualityToken")

  // console.log(upgrades)

  const mutualityToken = await upgrades.deployProxy(MutualityToken, [
    hre.ethers.utils.parseUnits("10000000", "ether"),
  ])
  await mutualityToken.deployed()
  console.log("mutuality deployed to:", mutualityToken.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
