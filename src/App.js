import React, { Component } from 'react'
import getWeb3 from './utils/getWeb3'
import { ZeroEx } from '0x.js'
import BigNumber from 'bignumber.js'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3        : null,
      zeroEx      : null,
      signedOrder : null,
      error       : null,
    }
  }

  async componentWillMount() {

    try {

      const { web3 } = await getWeb3
      const zeroEx = new ZeroEx(web3.currentProvider)

      console.log('Web3 version:', web3.version.api)
      console.log('Coinbase', await web3.eth.coinbase)

      this.setState({
        web3,
        zeroEx,
      })

      const signedOrder = await this.makeOrder()
      this.setState({ signedOrder })
    }
    catch(error) {
      console.log(error)
      this.setState({ error })
    }

  }

  async makeOrder() {

    const { web3, zeroEx } = this.state

    const orderHash = ZeroEx.getOrderHashHex({
      exchangeContractAddress: '0x90fe2af704b34e0224bf2299c838e04d4dcf1364',
      expirationUnixTimestampSec: '1508457600',
      feeRecipient: '0x0000000000000000000000000000000000000000',
      maker: web3.eth.coinbase,
      makerFee: new BigNumber(0),
      makerTokenAddress: '0x05d090b51c40b020eab3bfcb6a2dff130df22e9c',
      makerTokenAmount: new BigNumber(1),
      salt: '12345',
      taker: '0x0000000000000000000000000000000000000000',
      takerFee: new BigNumber(0),
      takerTokenAddress: '0x05d090b51c40b020eab3bfcb6a2dff130df22e9c',
      takerTokenAmount: new BigNumber(1),
    })

    return await zeroEx.signOrderHashAsync(orderHash, web3.eth.coinbase)

  }



  make() {

  }





  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Truffle Box</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              {this.renderWeb3Info()}
              {this.renderOrderInfo()}
              {this.renderError()}
            </div>
          </div>
        </main>
      </div>
    );
  }



  renderWeb3Info() {
    const { web3 } = this.state

    if (!web3) {
      return <p>Web3 not found</p>
    }
    return (
      <p>
        {'Web3 version: ' + web3.version.api}
        <br/>
        {'Coinbase: ' + web3.eth.coinbase}
      </p>
    )
  }



  renderOrderInfo() {
    return <p>{'Order: ' + JSON.stringify(this.state.signedOrder)}</p>
  }



  renderError() {
    if (this.state.error) {
      return (
        <p style={{color: 'red'}}>
          {'' + this.state.error}
        </p>
      )
    }
  }


}

export default App
