import React, { Component } from 'react'
import getWeb3 from './utils/getWeb3'
import { ZeroEx } from '0x.js'
import BigNumber from 'bignumber.js'
import ReactQueryParams from 'react-query-params';

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import Form from './Form'

class App extends ReactQueryParams {
  constructor(props) {
    super(props)

    this.state = {
      web3           : null,
      zeroEx         : null,
      signedOrder    : null,
      error          : null,

      coinbase       : null,
      transferAmount : 0,
      toAddr         : '',
    }

    this.handleSubmit       = this.handleSubmit.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleToAddrChange = this.handleToAddrChange.bind(this);

  }



  getCoinbase(web3) {
    return new Promise((resolve, reject) => {
      web3.eth.getCoinbase((error, coinbase) => {
        if (error) {
          reject(error)
        }
        resolve(coinbase)
      })
    })
  }



  async componentWillMount() {

    try {

      const { web3 } = await getWeb3
      const zeroEx = new ZeroEx(web3.currentProvider)
      console.log('Web3 version: ', web3.version.api)
      this.setState({ web3, zeroEx })

      const coinbase = await this.getCoinbase(web3)
      console.log('Coinbase: ', coinbase)
      this.setState({ coinbase })

      const signedOrder = await this.makeOrder(coinbase, zeroEx)
      this.setState({ signedOrder })

    }
    catch(error) {
      console.log(error)
      this.setState({ error })
    }

  }

  async makeOrder(coinbase, zeroEx) {

    console.log('Params: ', JSON.stringify(this.queryParams))
    const {
      tokenAddr,
    } = this.queryParams

    const orderHash = ZeroEx.getOrderHashHex({
      exchangeContractAddress    : '0x90fe2af704b34e0224bf2299c838e04d4dcf1364',
      expirationUnixTimestampSec : '1508457600',
      feeRecipient               : '0x0000000000000000000000000000000000000000',
      maker                      : coinbase,
      makerFee                   : new BigNumber(0),
      makerTokenAddress          : '0x05d090b51c40b020eab3bfcb6a2dff130df22e9c',
      makerTokenAmount           : new BigNumber(1),
      salt                       : ZeroEx.generatePseudoRandomSalt(),
      taker                      : ZeroEx.NULL_ADDRESS,
      takerFee                   : new BigNumber(0),
      takerTokenAddress          : '0x05d090b51c40b020eab3bfcb6a2dff130df22e9c',
      takerTokenAmount           : new BigNumber(1),
    })

    return await zeroEx.signOrderHashAsync(orderHash, coinbase)

  }



  handleSubmit() {
    const { transferAmount, toAddr } = this.state

    console.log('Amount: ', transferAmount)
    console.log('toAddr: ', toAddr)
  }



  handleAmountChange(event) {
    this.setState({ transferAmount: event.target.value });
  }



  handleToAddrChange(event) {
    this.setState({ toAddr: event.target.value });
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
              {this.renderTransferForm()}
            </div>
          </div>
        </main>
      </div>
    );
  }



  renderTransferForm() {

    return (
      <Form onSubmit={this.handleSubmit}>
        <label>
          To:
          <input
            type="text"
            value={this.state.toAddr}
            onChange={this.handleToAddrChange}
            />
        </label>
        <br />
        <label>
          Amount:
          <input
            type="text"
            value={this.state.transferAmount}
            onChange={this.handleAmountChange}
            />
          {/* <select value={this.state.targetTokenName}>
            <option selected value="eth">Grapefruit</option>
            <option value="ethwaterloo">Lime</option>
            <option value="gno">Coconut</option>
            <option value="mango">Mango</option>
          </select> */}
        </label>
        <input type="submit" value="Submit" />
      </Form>
    );

  }



  renderWeb3Info() {
    const { web3, coinbase } = this.state

    if (!web3) {
      return <p>Web3 not found</p>
    }
    return (
      <p>
        {'Web3 version: ' + web3.version.api}
        <br/>
        {'Coinbase: ' + coinbase}
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
