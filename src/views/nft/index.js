import React, { PureComponent } from 'react';
import * as Web3 from 'web3'
import { OpenSeaSDK, Network } from 'opensea-js'

class Nft extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {walletAddress: '', inputAddress: '', open: false}
      }
      componentDidMount() {

      }
      handleTest() {
        // Web3.util.toHex(123)
              // this.setState({
        //   open: false
        // })
        const provider = new Web3.providers.HttpProvider('https://mainnet.infura.io')
        const openseaSDK = new OpenSeaSDK(provider, {
            networkName: Network.Main,
            apiKey: process.env.REACT_APP_INFURA_API_KEY
        })
          console.log("openseaSDK", openseaSDK)
        // console.log(123123)
    }

    render() {
        return (
            <div> 
                <h1>123</h1>
                <button onClick={this.handleTest.bind(this)}>buy</button>
            </div>
        )
    }
}

export default Nft;