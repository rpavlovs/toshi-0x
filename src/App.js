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
import Snackbar         from 'material-ui/Snackbar';

import TOKEN            from './constants/token'



class App extends ReactQueryParams {

  constructor(props) {
    super(props)

    this.state = {
      signedOrder    : null,
      error          : false,
      hasErrored     : false,
      version        : null,


      maker             : '',
      makerToken        : TOKEN.ID.EWA,
      makerTokenAmount  : 1,
      taker             : '',
      takerToken        : TOKEN.ID.EWB,
      takerTokenAmount  : 2,

      exchangeRateAtoB  : 2,
      isTransfer        : true,
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
        isTransfer: !!this.queryParams.transfer,
      })

    }
    catch(error) {
      console.log(error)
      this.setState({ error, hasErrored: true })
    }

  }



  handleMakerAmountChange = (event, makerTokenAmount) => {

    const { makerToken, takerToken } = this.state

    makerTokenAmount = parseInt(makerTokenAmount, 10)

    this.setState({
      makerTokenAmount,
      takerTokenAmount: makerTokenAmount * TOKEN.EXCHANGE_RATE[makerToken][takerToken]
     })
  }
  handleMakerChange = (event, maker) => {
    this.setState({ maker })
  }
  handleMakerTokenChange = (event, index, makerToken) => {
    this.setState({ makerToken })
  }



  handleTakerAmountChange = (event, takerTokenAmount) => {
    const { makerToken, takerToken } = this.state

    takerTokenAmount = parseInt(takerTokenAmount, 10)

    this.setState({
      makerTokenAmount: takerTokenAmount * TOKEN.EXCHANGE_RATE[takerToken][makerToken],
      takerTokenAmount,
    })
  }
  handleTakerChange = (event, taker) => {
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
      this.setState({ error, hasErrored: true })
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
          maxWidth: '400px',
          textAlign: 'center',
          padding: '20px'
        }}
        zDepth={2}
        >

        <img
          style={{hight: '100px'}}
          src={'https://challengepost-s3-challengepost.netdna-ssl.com/photos/production/software_thumbnail_photos/000/549/873/datas/medium.png'}
          />

        {this.renderAddresses()}

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
            label={this.state.isTransfer ? 'Send' : 'Swap'}
            primary={true}
            fullWidth={true}
            onClick={this.handleSubmit}
          />
        </div>
        {/* <div>
          {this.renderError()}
        </div> */}
        <Snackbar
          style={{color: 'red'}}
          open={this.state.hasErrored}
          message={'' + this.state.error}
          autoHideDuration={4000}
          onRequestClose={() => this.setState({ hasErrored: false })}
        />
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



  renderAddresses() {

    if (!this.state.isTransfer)
      return

    return (
      <div>
        <TextField
          floatingLabelText={'from'}
          fullWidth={true}
          name={'makerAddress'}
          value={this.state.maker}
          onChange={this.handleMakerChange}
          disabled={true}
          />
        <TextField
          floatingLabelText={'to'}
          fullWidth={true}
          name={'takerAddress'}
          value={this.state.taker}
          onChange={this.handleTakerChange}
          />
      </div>
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
