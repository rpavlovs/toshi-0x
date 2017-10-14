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
      coinbase    : null,
    }
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

    console.log('Coinbase 2: ', coinbase)

    const orderHash = ZeroEx.getOrderHashHex({
      exchangeContractAddress: '0x90fe2af704b34e0224bf2299c838e04d4dcf1364',
      expirationUnixTimestampSec: '1508457600',
      feeRecipient: '0x0000000000000000000000000000000000000000',
      maker: coinbase,
      makerFee: new BigNumber(0),
      makerTokenAddress: '0x05d090b51c40b020eab3bfcb6a2dff130df22e9c',
      makerTokenAmount: new BigNumber(1),
      salt: ZeroEx.generatePseudoRandomSalt(),
      taker: ZeroEx.NULL_ADDRESS,
      takerFee: new BigNumber(0),
      takerTokenAddress: '0x05d090b51c40b020eab3bfcb6a2dff130df22e9c',
      takerTokenAmount: new BigNumber(1),
    })

    return await zeroEx.signOrderHashAsync(orderHash, coinbase)

  }



  make() {

  }

  async sendERC(coinbase) {
    
    const contractAddress = "0x59EC08F4C79a222E78e877F03b5d850E0FD15EF3"
    const abiArray = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_initialOwner","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]

    var MyContract = web3.eth.contract(abiArray);
    var myContractInstance = MyContract.at(contractAddress);

    return await myContractInstance.transfer('0x0005653D8b0b4414Ba17d0C722F97fa977cf3777', 1, {from: coinbase, gas: 21000000000});
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
