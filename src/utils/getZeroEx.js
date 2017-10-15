import web3Util   from './web3'
import { ZeroEx } from '0x.js'
import BigNumber  from 'bignumber.js'

const BACKEND_URL = `http://5f7b8f8d.ngrok.io`


let zeroEx = null



const init = async () => {
  if (zeroEx) return
  zeroEx = new ZeroEx(web3Util.getCurrentProvider())
}



const getSignedOrder = async ({
  makerTokenAddress,
  takerTokenAddress,
  makerTokenAmount
}) => {

  const response = await fetch(
    `${BACKEND_URL}/order/vals?` +
    `makerTokenAmount=${makerTokenAmount}&` +
    `makerTokenAddress=${makerTokenAddress}&` +
    `takerTokenAddress=${takerTokenAddress}`
  )

  const {
    ecSignature,
    salt,
    exchangeContractAddress,
    maker,
    takerTokenAmount,
    expirationUnixTimestampSec,
  } = await response.json()

  return {
    ecSignature: {
      r: ecSignature.r,
      s: ecSignature.s,
      v: parseInt(ecSignature.v, 10),
    },
    taker                      : ZeroEx.NULL_ADDRESS,
    makerTokenAmount           : new BigNumber(parseInt(makerTokenAmount, 10)),
    feeRecipient               : ZeroEx.NULL_ADDRESS,
    takerTokenAddress,
    makerFee                   : new BigNumber(0),
    takerTokenAmount           : new BigNumber(parseInt(takerTokenAmount, 10)),
    exchangeContractAddress,
    expirationUnixTimestampSec : new BigNumber(parseInt(expirationUnixTimestampSec, 10)),
    salt                       : new BigNumber(parseInt(salt, 10)),
    maker,
    takerFee                   : new BigNumber(0),
    makerTokenAddress,
  }

}



const fillOrder = async ({ amount, signedOrder }) => {
  const taker = await web3Util.getCoinbase()
  return await zeroEx.exchange.fillOrderAsync(
    signedOrder,
    ZeroEx.toBaseUnitAmount((new BigNumber(amount)).mul(10^18), 10),
    true,
    taker
  )
}



const swap = async ({
  makerTokenAddress,
  makerTokenAmount,
  takerTokenAddress,
  takerTokenAmount,
}) => {

  const signedOrder = await getSignedOrder({
    makerTokenAmount,
    makerTokenAddress,
    takerTokenAddress,
  })

  console.log('signedOrder: ', JSON.stringify(signedOrder))

  return await fillOrder({
    amount: takerTokenAmount,
    signedOrder
  })

}


const setAlowance = async (tokenAddress) => {
  await zeroEx.token.setProxyAllowanceAsync(
    tokenAddress,
    await web3Util.getCoinbase(),
    new BigNumber(2000000)
  )
}



export default {
  init,
  getSignedOrder,
  fillOrder,
  swap,
  setAlowance,
}
