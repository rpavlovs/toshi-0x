import React            from 'react'
import web3Util         from './utils/web3'
import zeroExUtil       from './utils/getZeroEx'
import ReactQueryParams from 'react-query-params';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField        from 'material-ui/TextField';
import SelectField      from 'material-ui/SelectField';
import MenuItem         from 'material-ui/MenuItem';
import Paper            from 'material-ui/Paper';
import RightArrow       from 'material-ui/svg-icons/action/trending-flat';
import RaisedButton     from 'material-ui/RaisedButton';

import TOKEN            from './constants/token'



class App extends ReactQueryParams {
  constructor(props) {
    super(props)

    this.state = {
      signedOrder    : null,
      error          : null,
      version        : null,


      maker             : '0x',
      makerToken        : TOKEN.ID.EWA,
      makerTokenAmount  : 0,
      taker             : '0x',
      takerToken        : TOKEN.ID.EWB,
      takerTokenAmount  : 0,

      exchangeRate      : 0,
    }

  }



  async componentWillMount() {

    try {

      await web3Util.init()
      await zeroExUtil.init()

      console.log(JSON.stringify(TOKEN))

      const version  = web3Util.getVersion()
      const coinbase = await web3Util.getCoinbase()
      console.log('Web3 version: ', version)
      console.log('Coinbase: ', coinbase)
      this.setState({
        version,
        maker: coinbase,
        taker: coinbase,
      })

    }
    catch(error) {
      console.log(error)
      this.setState({ error })
    }

  }



  handleMakerAmountChange = (event, index, makerTokenAmount) => {
    this.setState({ makerTokenAmount })
  }
  handleMakerChange = (event, index, maker) => {
    this.setState({ maker })
  }
  handleMakerTokenChange = (event, index, makerToken) => {
    this.setState({ makerToken })
  }



  handleTakerAmountChange = (event, index, takerTokenAmount) => {
    this.setState({ takerTokenAmount })
  }
  handleTakerChange = (event, index, taker) => {
    this.setState({ taker })
  }
  handleTakerTokenChange = (event, index, takerToken) => {
    this.setState({ takerToken })
  }



  handleSubmit = async (event) => {
    try {
      event.preventDefault();

      const {
        makerToken,
        makerTokenAmount,
        takerToken,
        takerTokenAmount,
      } = this.state

      const swapData = {
        makerTokenAddress: TOKEN.ADDRESS[makerToken],
        makerTokenAmount,
        takerTokenAddress: TOKEN.ADDRESS[takerToken],
        takerTokenAmount,
      }

      console.log('Swap: ', JSON.stringify(swapData))

      const filledOrder = await zeroExUtil.swap(swapData)

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
      <MuiThemeProvider>
        {this.renderPaper()}
      </MuiThemeProvider>
    )
  }




  renderPaper() {
    return(
      <Paper
        style={{
          margin: '50px auto 0',
          width: '500px',
          textAlign: 'center',
          padding: '50px 0 50px 0'
        }}
        zDepth={2}
        >

        <div>
          <TextField
            floatingLabelText={'from'}
            style={{width: '380px'}}
            name={'makerAddress'}
            value={this.state.maker}
            onChange={this.handleMakerChange}
            />
          <TextField
            floatingLabelText={'to'}
            style={{width: '380px'}}
            name={'takerAddress'}
            value={this.state.taker}
            onChange={this.handleTakerChange}
            />
        </div>

        <div style={{
          marginTop: '70px',
          display: 'flex',
          flexDirection: 'row',
          textAlign: 'center',
          justifyContent: 'center'
          }}
          >

          <div style={{width: '70px'}}>
            <SelectField
              fullWidth={true}
              name={'makerToken'}
              value={this.state.makerToken}
              onChange={this.handleMakerTokenChange}
              >
              {Object.values(TOKEN.ID).map(id =>
                <MenuItem key={id} value={id} primaryText={TOKEN.NAME[id]} />
              )}
            </SelectField>
            <br />
            <TextField
              fullWidth={true}
              name={'makerTokenAmount'}
              value={this.state.makerTokenAmount}
              onChange={this.handleMakerAmountChange}
              hintText="0.00"
            />
          </div>

          <div>
            <RightArrow
              style={{
                marginTop: '50px',
                marginLeft: '40px',
                marginRight: '40px',
              }}
            />
          </div>

          <div style={{width: '70px'}}>
            <SelectField
              fullWidth={true}
              name={'takerToken'}
              value={this.state.takerToken}
              onChange={this.handleTakerTokenChange}
              >
              {Object.values(TOKEN.ID).map(id =>
                <MenuItem key={id} value={id} primaryText={TOKEN.NAME[id]} />
              )}
            </SelectField>
            <br />
            <TextField
              fullWidth={true}
              name={'takerTokenAmount'}
              value={this.state.takerTokenAmount}
              onChange={this.handleTakerAmountChange}
              hintText="0.00"
            />
          </div>
        </div>

        <div style={{textAlign: 'center', marginTop: '70px'}}>
          <RaisedButton
            label="Send"
            primary={true}
            style={{width: '400px'}}
            onClick={this.handleSubmit}
          />
        </div>
        <div>
          {this.renderError()}
        </div>
        {/* <div>
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
        </div> */}
      </Paper>
    )
  }



  renderTransferForm() {

    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          To:
          <input
            type="text"
            value={this.state.taker}
            onChange={this.handleTakerChange}
            />
        </label>
        <br />
        <label>
          Amount sent:
          <input
            type="text"
            value={this.state.makerTokenAmount}
            onChange={this.handleMakerAmountChange}
            />
        </label>
        <br />
        <label>
          Amount recieved:
          <input
            type="text"
            value={this.state.takerTokenAmount}
            onChange={this.handleTakerAmountChange}
            />
        </label>
        <br />
        <input type="submit" value="Send" />
      </form>
    );

  }



  renderWeb3Info() {
    const { version } = this.state

    if (!version) {
      return <p>Web3 not found</p>
    }
    return (
      <p>
        {'Web3 version: ' + version}
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
