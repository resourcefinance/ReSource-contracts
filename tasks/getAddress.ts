import { task } from 'hardhat/config'
import '@nomiclabs/hardhat-waffle'

export enum CeloContractName {
  Accounts = 'Accounts',
  Attestations = 'Attestations',
  BlockchainParameters = 'BlockchainParameters',
  DoubleSigningSlasher = 'DoubleSigningSlasher',
  DowntimeSlasher = 'DowntimeSlasher',
  Election = 'Election',
  EpochRewards = 'EpochRewards',
  Escrow = 'Escrow',
  Exchange = 'Exchange',
  ExchangeEUR = 'ExchangeEUR',
  FeeCurrencyWhitelist = 'FeeCurrencyWhitelist',
  Freezer = 'Freezer',
  GasPriceMinimum = 'GasPriceMinimum',
  GoldToken = 'GoldToken',
  Governance = 'Governance',
  GovernanceSlasher = 'GovernanceSlasher',
  GovernanceApproverMultiSig = 'GovernanceApproverMultiSig',
  LockedGold = 'LockedGold',
  Random = 'Random',
  Reserve = 'Reserve',
  ReserveSpenderMultiSig = 'ReserveSpenderMultiSig',
  SortedOracles = 'SortedOracles',
  StableToken = 'StableToken',
  StableTokenEUR = 'StableTokenEUR',
  TransferWhitelist = 'TransferWhitelist',
  Validators = 'Validators',
}
task('getAddress', 'Get an address from the Celo Registry')
  .addParam('name', 'The name of the contract')
  .setAction(async ({ name }, hre) => {
    // const accounts = await hre.ethers.getSigners()

    const registry = await hre.ethers.getContractAt(
      'Registry',
      '0x000000000000000000000000000000000000ce10',
    )
    const tokenAddr = await registry.getAddressForString(name)
    console.log(name, 'is deployed at', tokenAddr)
  })

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

export default {
  solidity: '0.7.3',
}
