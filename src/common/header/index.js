
import React, { Component } from "react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { actionCreators } from './store';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom'
import { MainWrapper } from './style'
import dappWalletModal from "dapp-wallet-modal";
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3'

class Header extends Component {
    componentDidMount() {
     var wallet =  localStorage.getItem('injected')
     if(wallet){
      this.props.login()
     }
    }
    
    render() {
        return (
          <MainWrapper>
            <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
              <Toolbar>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                >
                  <img src="https://digination.xyz/v2/static/img/Logo.32abd69e.png" width={200} alt={"digination"} />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} className="cl-menu">
                    <Link to="/"> Home</Link>
                    <Link to="/tokentools"> Token Tools</Link>
                    <Link to="/nfttools"> NFT Tools</Link>
                    <Link to="/curve"> Curve Tools</Link>
                </Typography>
                { this.props.account ? 
                 <div>
                  <Button  variant="outlined" size="small" color="inherit" className="btu-spac" >{this.props.chainName}</Button> 
                  <Button  variant="outlined" size="small" color="inherit" className="btu-spac" >{getStarAccount(this.props.account)}</Button> 
                  <Button  variant="outlined" size="small" color="inherit" className="btu-spac" onClick={() => this.props.disconnect()}>disconnect</Button> 
                 </div>
                :
                <div>
                     <Button  variant="outlined" size="small" color="inherit" className="btu-spac" onClick={() => this.props.login()}>connect wallet</Button>
                </div>
                }
              
              </Toolbar>
            </AppBar>
          </Box>
        </MainWrapper>
        )

     
    }
}


const getStarAccount = (str, frontLen = 6, endLen = 4, cha = '...') => {
  // if()
  if (str.length > 0) {
    var len = str.length - frontLen - endLen
    var xing = ''
    for (var i = 0; i < len; i++) {
      xing += cha
    }
    var stt = str.substring(0, frontLen) + xing + str.substring(str.length - endLen)
    return stt.slice(0, 7) + stt.substr(-6, 6)
  }
}

const CHAINID = 4 

const providerOptions = {
  logo: "",
  maskColor:'rgb(30, 30, 30, 0.8)',
  bgColor:'#363636',
  borderColor:'#faba30',
  chainId: CHAINID,
  walletOptions: {
    metamask: {
      displayView: {
        logo: "https://docs.metamask.io/metamask-fox.svg", // your Wallet logo
        name: "MetaMask", // your Wallet name
      },
      options: {
        drive: detectEthereumProvider,  //  drive package
      }
    }
  }
}

const mapState = (state) => ({
    walletProvider: state.getIn(['header', 'walletProvider']),
    account: state.getIn(['header', 'account']),
    chainId: state.getIn(['header', 'chainId']),
    chainName: state.getIn(['header', 'chainName'])
})
 const fetcher = async (...args) => fetch(...args).then((res) => res.json());
 const getBlockChainNameByChainId = async (chainId = 4) => {
  const chains = await fetcher('https://chainid.network/chains.json');
  let newArr = chains.filter(item => item.chainId === chainId)
  return  newArr[0]
}

const mapDispatch = (dispatch) => ({
    async login() {
      const walletModal = new dappWalletModal(providerOptions);
      const provider = await walletModal.connect();
    
      if(provider){
        // Subscribe to accounts change
        provider.on("accountsChanged", (accounts) => {
          dispatch(actionCreators.setAccount(accounts[0]));
        });

        // Subscribe to chainId change
        provider.on("chainChanged", async (chainId) => {
          var changedChainId= Web3.utils.hexToNumberString(chainId)
          dispatch(actionCreators.setChainId(Number(changedChainId)));
          var chain = await  getBlockChainNameByChainId(Number(changedChainId))
          dispatch(actionCreators.setChainName(chain.name)); 
        });

        // Subscribe to provider connection
        provider.on("connect", (info) => {
          console.log(info);
        });
        
        // Subscribe to provider disconnection
        provider.on("disconnect", (error) => {
          console.log(error);
        });
        var web3Obj = new Web3(provider)
        var chainId = await web3Obj.eth.net.getId()
        var accounts = await web3Obj.eth.getAccounts()
        var chain = await  getBlockChainNameByChainId(chainId)
        dispatch(actionCreators.setWellatProvider(provider));
        dispatch(actionCreators.setAccount(accounts[0]));
        dispatch(actionCreators.setChainId(chainId)); 
        dispatch(actionCreators.setChainName(chain.name)); 
      }else{
         console.log("error")
      }
    },
    async disconnect() {
      const walletModal = new dappWalletModal(providerOptions);
      await walletModal.disconnect();
      dispatch(actionCreators.setAccount(''));
      dispatch(actionCreators.setWellatProvider(''));
      dispatch(actionCreators.setChainId(''));
      dispatch(actionCreators.setChainName(""));
    }
})

export default connect(mapState, mapDispatch)(Header);


