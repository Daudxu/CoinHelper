import React, { PureComponent } from 'react';
import Button from '@mui/material/Button';

import { DataWrapper } from './style'
import Input from '@mui/material/Input';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { DataGrid } from '@mui/x-data-grid'; 
import { curveFinanceApi } from  "../../api/apollo.js"
const ariaLabel = { 'aria-label': 'description' };

const columns = [
  { field: 'id', headerName: 'ID', width: 380 },
  { field: 'type', headerName: 'type', width: 180 },
  { field: 'typename', headerName: 'type name', width: 180 },
  { field: 'tokenID', headerName: 'token ID', width: 380 },
  { field: 'tokenName', headerName: 'token Name', width: 180 },
  { field: 'tokenDecimals', headerName: 'token Decimals', width: 120 },
  { field: 'tokenSymbol', headerName: 'token Symbol', width: 100 },
  { field: 'tokenTypename', headerName: 'token Typename', width: 120 },
  { field: 'tokenLastPriceBlockNumber', headerName: 'token LastPriceBlockNumber', width: 100 },
  { field: 'tokenLastPriceUSD', headerName: 'token LastPriceUSD', width: 100 },
];

class TokenSnapshot extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            rows: [],
            open: false,
        };
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
      this.handleClick()
    }

    handleClick() {
      this.setState({open: true})
        var sql =`
        {
            liquidityPoolHourlySnapshots(sort: "timestamp:desc"){
              id
              protocol {
                id
                name
                slug
              }
              pool {
                id
                name
              }
              blockNumber
              timestamp
              totalValueLockedUSD
              hourlyVolumeUSD
              hourlyVolumeByTokenAmount
              hourlyVolumeByTokenUSD
              cumulativeVolumeUSD
              inputTokenBalances
              inputTokenWeights
              outputTokenSupply
              outputTokenPriceUSD
              stakedOutputTokenAmount
              rewardTokenEmissionsAmount
              rewardTokenEmissionsUSD
            }
        }  
        `;
        curveFinanceApi(sql).then((result) => {
            console.log('result',result)
            var arr = [];
            result.data.rewardTokens.forEach((item) => {
                let row = {
                    id : item.id,
                    tokenID : item.token.id,
                    tokenName : item.token.name,
                    tokenDecimals : item.token.decimals,
                    tokenLastPriceBlockNumber : item.token.lastPriceBlockNumber,
                    tokenLastPriceUSD : item.token.lastPriceUSD,
                    tokenSymbol : item.token.symbol,
                    tokenTypename : item.token.__typename,
                    type : item.type,
                    typename : item.__typename,
                }
                arr.push(row)
            })
            this.setState({rows: arr})
            this.setState({open: false})
        });
    }

    handleClose() {
      this.setState({open: false})
    }
    
    render() {
        return (
            
            <DataWrapper>
              <Box
                component="form"
                sx={{
                  '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
              >
                  <Input placeholder="ID" inputProps={ariaLabel} />
                  <Button variant="contained" onClick={this.handleClick}>seach</Button>
              </Box>
    
              <div style={{ height: 700, width: '100%' }}>
                <DataGrid
                    rows={this.state.rows}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    checkboxSelection
                />
              </div>

              <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={this.state.open}
        onClick={this.handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
            </DataWrapper>
        )
    }
}

export default TokenSnapshot;
