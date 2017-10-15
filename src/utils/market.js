

const getQuote = async ({ makerTokenAddress, takerTokenAddress, amount }) => {

  const { exchangeRate } = this.state.order

  if (exchangeRate)
    return amount * exchangeRate

  const makerTokenName = 'storj'
  const takerTokenName = '0x'

  const makerToken = fetch(`https://api.coinmarketcap.com/v1/ticker/${makerTokenName}`)
  const takerToken = fetch(`https://api.coinmarketcap.com/v1/ticker/${takerTokenName}`)

  this.setState({ order: {
    exchangeRate: makerToken.price_usd / takerToken.price_usd
  } })
  return amount * exchangeRate
}


export default {
  getQuote
}
