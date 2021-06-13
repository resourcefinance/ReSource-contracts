const hre = require('hardhat')
import { CeloProvider } from '@celo-tools/celo-ethers-wrapper'

const MutualityToken = require('../../artifacts/src/services/ledger/contracts/MutualityToken.sol/MutualityToken.json')

const muAddress = '0xBcd563AB005b5Fa59E26F9C799B73a48C4f4184E'

const targetWallet = '0x00828d901565f5A8cE17f7D9D35037bD4b00ad98'

async function main() {
  const connectionInfo = hre.config.networks.testnet
  const provider = new CeloProvider(connectionInfo.url)
  await provider.ready

  const muAbi = MutualityToken.abi

  const signerAddress = await hre.ethers.getSigner()

  const muContract = new hre.ethers.Contract(muAddress, muAbi, signerAddress)

  await (
    await muContract.transfer(
      targetWallet,
      hre.ethers.utils.parseUnits('750000', 'ether'),
    )
  ).wait()
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
