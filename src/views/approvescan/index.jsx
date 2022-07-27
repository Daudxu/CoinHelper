import React, { PureComponent } from 'react';
// import * as React from 'react';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from "@mui/material/Box";
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Wrapper } from './style'
import ApproveList from './ApproveList';
import Web3 from "web3"
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

class Approvescan extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {walletAddress: '', inputAddress: '', open: false}
  }

   handleCnhangeInput =  (event) => {
    this.setState({
      walletAddress: event.target.value
    })
  }

  handleScan = () => {
  const {walletAddress } = this.state
  var isTrue =  Web3.utils.isAddress(walletAddress)
  if(isTrue) {

    this.setState({
      inputAddress: walletAddress,
      open: true
    })
  }else{
    alert('Address format error')
  }

}
  handleClose  ()  {
    this.setState({
      open: false
    })
  }
  render() {
    // const { loginStatus } = this.props;
    const {walletAddress, inputAddress, open } = this.state

    return (
      <Wrapper>
      <Container maxWidth="xm">
          <Box sx={{ margin:'0  auto', height: '100vh', width:'60%'}} > 
          <Typography variant="h4" component="div" className='cl-item-line'>
              Wallet Approve Scan
          </Typography>
          <Stack spacing={2} direction="row"  className='cl-item-line'> 
          
          <TextField id="outlined-basic"  value={walletAddress}  onChange={this.handleCnhangeInput} label="Wallet Address"  fullWidth={true} variant="outlined" />
          <Button variant="contained" onClick={this.handleScan}>Scan</Button>
          </Stack>
  
          <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="spanning table">
            <TableHead>
              <TableRow>
                <TableCell>Token Name</TableCell>
                <TableCell align="right">Type</TableCell>
                <TableCell align="right">Token balance</TableCell>
                <TableCell align="right">Option</TableCell>
              </TableRow>
            </TableHead>
            <ApproveList
              inputAddress={inputAddress}
              open={open}
              handleClose={this.handleClose.bind(this)}
              />
          </Table>
      </TableContainer>
          </Box>
        </Container>
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
            onClick={this.handleClose.bind(this)}
        >
        <CircularProgress color="inherit" />
      </Backdrop>
        </Wrapper>
    )
   
  }
}

export default (Approvescan);