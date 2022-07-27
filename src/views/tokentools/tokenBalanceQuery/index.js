import React, { PureComponent } from 'react';
// import * as React from 'react';
import Box from "@mui/material/Box";
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { Wrapper } from './style'
import { ERC20TOKEN_ABI } from "../../../config/settings.js";
import Web3 from "web3/dist/web3.min.js";
import { connect } from 'react-redux';

const vertical = 'top'
const horizontal = 'right'
class Approve extends PureComponent {
  constructor(props) {
    super(props); 
    this.state = {tokenAddress: '', walletAddress: '',  open: false,  messageData: "", balanceOf: 0} 
  }

  handleAction = async () => {

  const {tokenAddress, walletAddress } = this.state
  var tokenAddressIsTrue =  Web3.utils.isAddress(tokenAddress)
  var walletAddressIsTrue =  Web3.utils.isAddress(walletAddress)

  if(tokenAddressIsTrue && walletAddressIsTrue ) {
        var web3Obj = new Web3(this.props.walletProvider)
        var myContract = new web3Obj.eth.Contract(ERC20TOKEN_ABI, tokenAddress) 
        await  myContract.methods.balanceOf(walletAddress).call({ from: walletAddress}).then((res)=>{
            this.setState({
              open: true,
              balanceOf: res,
              messageData : {
                msgType: 'success',
                message: 'Approve Success.',
              }
            })
        }).catch((err)=>{
            this.setState({
              open: true,
              messageData : {
                msgType: 'error',
                message: `code: ${err.code}  message: ${err.message}`,
              }
            })
        })
  }else{
    this.setState({
      open: true,
      messageData : {
        msgType: 'error',
        message: 'Please check whether the address format and quantity are correct.',
      }
    })
  }

}

  handleCnhange = (e) => {
  const {value, name} = e.target
      this.setState({
          [name]: value
      })
  }

   handleClose = () => {
    this.setState({
      open: false
    })
  };
  render() {
    // const { loginStatus } = this.props;
    const {tokenAddress, walletAddress, open, messageData, balanceOf } = this.state

    return (
      <Wrapper>
         <Container maxWidth="xm">
          <Box sx={{ margin:'0  auto', height: '100vh', width:'35%'}} > 
          
          <Typography variant="h4" component="div" className='cl-item-line'>
              Token balance query
          </Typography>

          <Stack spacing={2} direction="row"  className='cl-item-line'> 
          
          <TextField id="outlined-basic" name="tokenAddress"  value={tokenAddress} label="Token Address" onChange={this.handleCnhange}  fullWidth={true} variant="outlined" />
     
          </Stack>

          <Stack spacing={2} direction="row"  className='cl-item-line'> 
          
          <TextField id="outlined-basic" name="walletAddress" value={walletAddress} label="wallet Address" onChange={this.handleCnhange} fullWidth={true} variant="outlined" />
     
          </Stack>

          {/* <Stack spacing={2} direction="row"  className='cl-item-line'> 
          
          <TextField id="outlined-basic" name="walletAddress" value={balanceOf} label="balanceOf" disabled onChange={this.handleCnhange} fullWidth={true} variant="outlined" />
     
          </Stack> */}
          <Typography variant="h6" component="div" className='cl-item-line'>
              balanceOf: {balanceOf}
          </Typography>
          
          <Stack spacing={2} direction="row" sx={{ display: 'flex', justifyContent: 'center' }}  className='cl-item-line' alint="center"> 
              <Button variant="contained" onClick={this.handleAction}>Action</Button>
          </Stack>
            </Box>
         </Container>
        <Snackbar open={open} autoHideDuration={3000} onClose={this.handleClose} anchorOrigin={{ vertical, horizontal }}>
            <Alert onClose={this.handleClose} severity={messageData.msgType} sx={{ width: "100%" }}>
              {messageData.message}
            </Alert>
        </Snackbar>
      </Wrapper>
    )
   
  }
}
const mapState = (state) => ({
  walletProvider: state.getIn(['header', 'walletProvider']),
  account: state.getIn(['header', 'account']),
  chainId: state.getIn(['header', 'chainId']),
  chainName: state.getIn(['header', 'chainName'])
})

export default connect(mapState)(Approve);
