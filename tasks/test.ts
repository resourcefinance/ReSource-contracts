import { CeloProvider, CeloWallet } from "@celo-tools/celo-ethers-wrapper"
import { task } from "hardhat/config"
import "@nomiclabs/hardhat-waffle"

// TODO: can use https://ethereum.stackexchange.com/questions/60995/how-to-get-private-keys-on-truffle-from-ganache-accounts
// to get secret keys in a more elegant way, but hard coding for now from ganache console logs
// see https://hub.docker.com/repository/docker/resourcenetwork/celo-livenet for private keys

task("test", "Some test action", async (args, hre) => {
  let tx
  let receipt

  /// Connect
  const provider = new CeloProvider()
  await provider.ready
  const accounts = await provider.listAccounts()

  // FACTORIES
  const signaturesAddress = "0xcdB594a32B1CC3479d8746279712c39D18a07FC0"
  const metaTransactionWallet = await hre.ethers.getContractFactory("MetaTransactionWallet", {
    libraries: {
      Signatures: signaturesAddress,
    },
  })
  const multiSigWalletFactory = await hre.ethers.getContractFactory("MultiSig")
  const mutualCreditResourceFactory = await hre.ethers.getContractFactory("MutualCreditResource")

  const rUSD = await mutualCreditResourceFactory.deploy()
  rUSD.deployTransaction.wait()
  console.log("rUSD", rUSD.address)
  // const rUSD = await hre.ethers.getContractAt(
  //   "MutualCreditResource",
  //   "0x622193D6428527563E36c1f949cA80002545f134",
  // )

  // 1. main sugardaddy account
  const sugarDaddyAddr = accounts[0]
  const sugarDaddySk = "0xf2f48ee19680706196e2e339e5da3491186e0c4c5030670656b0e0164837257d"
  let sugarDaddy = new CeloWallet(sugarDaddySk, provider)
  // 2. get a business account
  const businessAAddr = accounts[2]
  const businessASk = "0xdf02719c4df8b9b8ac7f551fcb5d9ef48fa27eef7a66453879f4d8fdc6e78fb1"
  let businessA = new CeloWallet(businessASk, provider)
  // 3. meta transaction wallet, for an account, & set the guardian to sugar daddy
  const metaBusinessA = await metaTransactionWallet.deploy(true)
  metaBusinessA.deployTransaction.wait()
  metaBusinessA.setGuardian(sugarDaddy.address)
  console.log("metaBusinessA", metaBusinessA.address)
  // const metaBusinessA = await hre.ethers.getContractAt(
  //   "MetaTransactionWallet",
  //   "0x1CDa081027Eb989632e63313aff5e9d3E839AC1F",
  // )

  // Deploy 2/3 multisig wallets
  const multisigA = await multiSigWalletFactory.deploy()
  multisigA.deployTransaction.wait()
  tx = await (await multisigA.initialize([sugarDaddy.address, businessA.address], 1, 1)).wait()
  console.log("multisigA", multisigA.address)
  // const multisigA = await hre.ethers.getContractAt(
  //   "MultiSig",
  //   "0x535071c86D8aD9b981C4e0a53bBE503868E7cbDC",
  // )
  await (
    await rUSD.setCreditLimit(multisigA.address, hre.ethers.utils.parseUnits("10000", 6))
  ).wait()

  // Send rUSD from businessA to businessB
  // const amt = hre.ethers.utils.parseUnits("10.0", 6)
  const amt = 10

  // ok so i gotta transfer this from multisig
  const transferFn = rUSD.interface.getFunction("transfer")
  console.log("transferFn", transferFn)
  const rusdSendTx = rUSD.interface.encodeFunctionData("transfer", [sugarDaddy.address, amt])
  console.log("rusdSendTx", rusdSendTx)

  // submittransaction
  const submitTx = await multisigA
    .connect(sugarDaddy)
    .submitTransaction(rUSD.address, 0, rusdSendTx)
  const txId = await submitTx.wait()
  console.log(txId)

  // confirm a
  // confirm b
  // execute

  // const sig1 = await businessA.signTransaction({
  //   ...tx,
  // })
  // const sig2 = await sugarDaddy.signTransaction({
  //   ...tx,
  // })

  // const confirmTx = await multisigA.populateTransaction.confirmTransaction(txId, {
  //   from: businessA,
  // })
  // await (await businessA.sendTransaction(confirmTx)).wait()

  // server submits their tx and stores tx index to execute later
  // let receiptServer = await multisigA.submitTransaction(msB.address, 0, businessASignedTx)
  // await receiptServer.wait()
  // let businessMetaTxSend = await mtwA.populateTransaction.executeTransaction(msA.address, 0, businessASignedTx)

  // console.log('businessMetaTxSend', businessMetaTxSend)
  // const gasLimit = 1000000
  // let x = await walletServer.sendTransaction({
  //   ...businessMetaTxSend,
  //   gasLimit,
  //   gasPrice: adjustedGasLimit,
  // })
  // console.log(x)
  // let receiptBusinessA = await msA.submitTransaction(msB.address, 0, businessASignedTx)
  // let receiptServer = await msA.submitTransaction(msB.address, 0, serverSignedTx)

  // server submits meta tx call to multisig
  // const msBusinessASigner = multiSigWallet.connect(walletBusinessA)
  // const submitTx = msBusinessASigner.submitTransaction()

  // console.log('msBusinessASigner.submitTransaction', )
  // const resMetaTxExec = mtwA.executeTransaction(
  //   msA.address,
  //   0,
  //   businessASignedTx
  // )

  // server executes tx
  // console.log('done', done)

  // verify business b balance
})

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

export default {
  solidity: "0.7.3",
}

// const accounts = await hre.ethers.getSigners()
// const registry = await hre.ethers.getContractAt(
//   "Registry",
//   "0x000000000000000000000000000000000000ce10",
// )
// const metaTxAddr = await registry.getAddressForString("GoldToken")
// console.log(metaTxAddr)
