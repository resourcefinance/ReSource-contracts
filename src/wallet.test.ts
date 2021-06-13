import { createWallet } from "./wallet.service"

import { ethers, config } from "hardhat"
import { HttpNetworkConfig } from "hardhat/types"
import { CeloProvider } from "@celo-tools/celo-ethers-wrapper"

describe("Wallet Functional Tests", function () {
  it("Deploys a multisig and metatransaction wallet given 3 wallets", async () => {
    const connectionInfo = config.networks.testnet as HttpNetworkConfig
    const provider = new CeloProvider(connectionInfo.url)
    await provider.ready
    // todo: create 3 new random wallets
    console.log(ethers)

    const clientWallet = ethers.Wallet.createRandom()
    const apiWallet = ethers.Wallet.createRandom()
    const custodianWallet = ethers.Wallet.createRandom()

    const wallets = await createWallet(
      clientWallet.address,
      apiWallet.address,
      custodianWallet.address,
    )

    expect(wallets?.metaAddress).toBeTruthy() // TODO: get Waffle working with Jest
    // expect(wallets?.multisigAddress).toBeTruthy()
  })
})
