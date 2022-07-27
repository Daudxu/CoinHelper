import React, { PureComponent } from 'react';
import Button from '@mui/material/Button';
// import { gql } from '@apollo/client';
import { MainWrapper } from './style'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

import { DataGrid, GridColDef } from '@mui/x-data-grid'; 
import { curveFinanceApi } from  "../../api/apollo.js"

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 350 },
  { field: 'name', headerName: 'token name', width: 350 },
  { field: 'symbol', headerName: 'symbol', width: 350 },
  { field: '__typename', headerName: 'type name', width: 130 },
];

class TokenSnapshot extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            copied: false,
            content: [],
            open: false,
            vertical: 'top',
            message: '',
            horizontal: 'center',
            msgType: 'info',
            isloading: false,
            rows: []
        };
        this.handleClick = this.handleClick.bind(this);
    }

  async  handleClick() {
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
      console.log(result.data.tokens)
      this.setState({rows: result.data.tokens})
  });

}
    
    render() {
        return (
            <MainWrapper>
                    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
    <TextField id="outlined-basic" label="Outlined" variant="outlined" />
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
            </MainWrapper>
        )
    }
}

export default TokenSnapshot;
