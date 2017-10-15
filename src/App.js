import React, { Component } from 'react'
import web3Util             from './utils/web3'
import zeroExUtil           from './utils/getZeroEx'
import { ZeroEx }           from '0x.js'
import ReactQueryParams     from 'react-query-params';

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'



class App extends ReactQueryParams {
  constructor(props) {
    super(props)

    this.state = {
      signedOrder    : null,
      error          : null,
      version        : null,
      coinbase       : null,

      order: {
        makerTokenAddress : '0x05d090b51c40b020eab3bfcb6a2dff130df22e9c',
        makerTokenAmount  : 0,
        takerTokenAddress : '0x05d090b51c40b020eab3bfcb6a2dff130df22e9c',
        takerTokenAmount  : 0,
        taker             : '0x',
        exchangeRate      : 0,
      }
    }

    this.handleSubmit            = this.handleSubmit.bind(this);
    this.handleMakerAmountChange = this.handleMakerAmountChange.bind(this);
    this.handleTakerAmountChange = this.handleTakerAmountChange.bind(this);
    this.handleTakerChange       = this.handleTakerChange.bind(this);

  }



  async componentWillMount() {

    try {

      await web3Util.init()
      await zeroExUtil.init()

      // await zeroExUtil.setAlowance('0x6FC773BA50dc1dc6A4A3698251BAF3Cee1B6eb26'.toLowerCase())
      // await zeroExUtil.setAlowance('0x92112771f33BE187CaF2226a041bE6F2bC2319f5'.toLowerCase())

      const version  = web3Util.getVersion()
      const coinbase = await web3Util.getCoinbase()
      console.log('Web3 version: ', version)
      console.log('Coinbase: ', coinbase)
      this.setState({ version, coinbase })

    }
    catch(error) {
      console.log(error)
      this.setState({ error })
    }

  }



  handleMakerAmountChange(event) {

    const newMakerAmount = event.target.value

    const {
      makerTokenAddress,
      takerTokenAddress,
    } = this.state.order

    this.setState({ order: {
      makerTokenAmount: newMakerAmount,
      // takerTokenAddress: quote,
    } });

  }



  handleTakerAmountChange(event) {
    this.setState({ order: { takerTokenAmount: event.target.value } });
  }



  handleTakerChange(event) {
    this.setState({ order: { taker: event.target.value } });
  }



  async handleSubmit(event) {
    try {
      event.preventDefault();

      const {
        // makerTokenAmount,
        // takerTokenAmount,
        // makerTokenAddress,
        // takerTokenAddress,
      } = this.state.order

      const filledOrder = await zeroExUtil.swap({
        makerTokenAddress : '0x6FC773BA50dc1dc6A4A3698251BAF3Cee1B6eb26'.toLowerCase(),
        makerTokenAmount  : 1,
        takerTokenAddress : '0x92112771f33BE187CaF2226a041bE6F2bC2319f5'.toLowerCase(),
        takerTokenAmount  : 1,
      })

      console.log('Filled order: ', filledOrder)
      this.setState({ signedOrder: filledOrder })

    }
    catch(error) {
      console.log(error)
      this.setState({ error })
    }

  }





  ////////////////
  // RENDERINGS //
  ////////////////



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
      <form onSubmit={this.handleSubmit}>
        <label>
          To:
          <input
            type="text"
            value={this.state.order.taker}
            onChange={this.handleTakerChange}
            />
        </label>
        <br />
        <label>
          Amount sent:
          <input
            type="text"
            value={this.state.order.makerTokenAmount}
            onChange={this.handleMakerAmountChange}
            />
        </label>
        <br />
        <label>
          Amount recieved:
          <input
            type="text"
            value={this.state.order.takerTokenAmount}
            onChange={this.handleTakerAmountChange}
            />
        </label>
        <br />
        <input type="submit" value="Send" />
      </form>
    );

  }



  renderWeb3Info() {
    const { version, coinbase } = this.state

    if (!version) {
      return <p>Web3 not found</p>
    }
    return (
      <p>
        {'Web3 version: ' + version}
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
