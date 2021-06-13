import { ContractFunction, BigNumber } from "ethers"

export const tryWithGas = async (func: ContractFunction, args: Array<any>, gas: BigNumber) => {
  let tries = 0
  let deployed = false
  while (!deployed) {
    tries += 1
    gas = gas.shl(tries)
    let options = { gasLimit: gas }
    try {
      const result = await func(...args, options)
      await result.wait()
      deployed = true
      console.log("Deployed")
      return result
    } catch (e) {
      console.log("Not enough Gas. Retrying...")
      if (tries >= 5) throw e
      console.log("Error:", e.reason, e.code, e.transactionHash)
    }
  }
}
