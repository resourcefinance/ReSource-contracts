import { ethers } from "hardhat"
import { ContractFunction } from "ethers"
// import { ContractFunction } from "hardhat/internal/hardhat-network/stack-traces/model"
import { config } from "../../config"
import { tryWithGas } from "./utils/tryWithGas"

export const createWallet = async (
  clientAddress: string,
  apiAddress: string, // remove this and use operator wallet
  custodianAddress: string,
) => {
  // Deploy meta transaction wallet for client
  const metaTransactionWalletAddress = await tryDeployMetaTransaction(clientAddress, apiAddress)

  // Deploy multisig wallet
  const multiSigAddress = await tryDeployMultiSigWallet(
    clientAddress,
    metaTransactionWalletAddress,
    apiAddress,
  )

  return {
    multisigAddress: multiSigAddress,
    metaAddress: metaTransactionWalletAddress,
  }
}

const tryDeployMultiSigWallet = async (
  clientAddress: string,
  clientMetaAddress: string,
  serverAddress,
): Promise<string> => {
  console.log("Deploying MultiSig...")
  const MultiSigWallet = await ethers.getContractFactory("MultiSig")
  const multiSigWallet = await MultiSigWallet.deploy()

  const initializeMultiSig = multiSigWallet.initialize as ContractFunction
  const initializeMultiSigArgs = [[serverAddress, clientMetaAddress, clientAddress], 2, 2]
  let gas = await multiSigWallet.estimateGas.initialize(
    [serverAddress, clientMetaAddress, clientAddress],
    2,
    2,
  )

  await tryWithGas(initializeMultiSig, initializeMultiSigArgs, gas)

  return multiSigWallet.address
}

const tryDeployMetaTransaction = async (
  clientAddress: string,
  serverAddress: string,
): Promise<string> => {
  console.log("Deploying MetaTransaction...")
  const signaturesAddress = "0xcdB594a32B1CC3479d8746279712c39D18a07FC0"
  const MetaTransactionWallet = await ethers.getContractFactory("MetaTransactionWallet", {
    libraries: {
      Signatures: signaturesAddress,
    },
  })
  const metaTransactionWallet = await MetaTransactionWallet.deploy(clientAddress)

  const setGuardian = metaTransactionWallet.setGuardian as ContractFunction
  const setGuardianArgs = [config.WALLETS.MASTER_WALLET_ADDRESS]
  let gas = await metaTransactionWallet.estimateGas.setGuardian(serverAddress)

  await tryWithGas(setGuardian, setGuardianArgs, gas)

  return metaTransactionWallet.address
}
