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
  { field: 'name', headerName: 'token name', width: 480 },
  { field: 'symbol', headerName: 'symbol', width: 200 },
  { field: 'decimals', headerName: 'decimals', width: 100 },
  { field: '__typename', headerName: 'type name', width: 130 },
  { field: 'lastPriceUSD', headerName: 'lastPriceUSD', width: 180 },
  { field: 'lastPriceBlockNumber', headerName: 'lastPriceBlockNumber', width: 180 },

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
          tokens(first: 1000) {
            id
            name
            symbol
            decimals
            lastPriceUSD
            lastPriceBlockNumber
          }
        }    
        `;
        curveFinanceApi(sql).then((result) => {
            this.setState({rows: result.data.tokens})
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
