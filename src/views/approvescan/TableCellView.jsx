import React, { PureComponent } from 'react';
import TableCell from '@mui/material/TableCell';
import { compareBN} from '../../utils/tools';
import Button from '@mui/material/Button';
import { connect } from 'react-redux';
import { actionCreators } from './store';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { formatAllowance, getAllowancesFromApprovals } from '../../utils/ERC20/util';
import Web3 from "web3/dist/web3.min.js";
import { ERC20TOKEN_ABI } from "../../config/settings.js";

const vertical = "top"
const horizontal = "right"

class TableCellView extends PureComponent {
        constructor(props) {
            super(props);               
            this.state = {allowancesList:[], inputAddress:"", snackbarOpen: false, messageData:[]}
        }
         
        componentDidMount(){
            var isFirst = this.props.isFirst
            if(!isFirst){
                this.props.setIsFirst(true)
                this.loadData ()
            }
        } 

        componentDidUpdate(){
            const {inputAddress} = this.state
            if(inputAddress !== this.props.inputAddress) {
                this.loadData ()
            }
        }
        sendMessage (type, nsg) {
            this.setState({
                snackbarOpen: true,
                messageData: {
                     msgType: type ? type : "info", 
                     message: nsg
                }
            })
            var _this = this
            setTimeout(()=>{
                _this.setState({
                    snackbarOpen: false,
                })
            },3000)
          }

        async handleUnApprove(contract, spender) {
            var web3Obj = new Web3(this.props.walletProvider)
            var myContract = new web3Obj.eth.Contract(ERC20TOKEN_ABI, contract.address) 
            await  myContract.methods.approve(spender[0].spender, 0).send({ from: this.props.account}).then((res)=>{
                this.sendMessage('success', "Unapprove Success")
                this.setState({
                    allowancesList: [],
                })
            }).catch((err)=>{
                this.sendMessage('error',`code: ${err.code}  message: ${err.message}`)
            })
        }

        async loadData (){
            
            const {token, inputAddress} = this.props;
            let allowancesList = (await getAllowancesFromApprovals(token.contract, inputAddress, token.approvals))
            .filter(({ allowance }) => formatAllowance(allowance, token.decimals, token.totalSupply) !== '0.000')
            .sort((a, b) => -1 * compareBN(a.allowance, b.allowance));
       
            this.setState({
                allowancesList: allowancesList ? allowancesList : [],
                inputAddress: inputAddress
            })
        }

        handleCloseTip (event, reason){
            if (reason === 'clickaway') {
              return;
            }
            this.setState({
                snackbarOpen: false,
                messageData: {
                     msgType: "info", 
                     message: ""
                }
            })
            // setSnackbarOpen(false);
        };

        render () {
             const { allowancesList, snackbarOpen, messageData } = this.state
             const {token} = this.props;
             if(!token) return 
            return (
                <TableCell align="right">
                        {allowancesList.length === 0 ? (
                        <div className="Allowance">No Allowances</div>
                        ) : (
                        <Button variant="outlined" size="small" onClick={()=>{this.handleUnApprove (token.contract, allowancesList)}}>
                                UnApprove 
                        </Button>
                        )}
                         <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={()=>this.handleCloseTip.bind(this)} anchorOrigin={{ vertical, horizontal }}>
                            <Alert onClose={()=>this.handleCloseTip.bind(this)} severity={messageData.msgType} sx={{ width: "100%" }}>
                            {messageData.message}
                            </Alert>
                        </Snackbar>
                </TableCell>
            )
        }
}


const mapState = (state) => ({
    isFirst: state.getIn(['approvescan', 'isFirst']),
    walletProvider: state.getIn(['header', 'walletProvider']),
    account: state.getIn(['header', 'account']),
    chainId: state.getIn(['header', 'chainId']),
    chainName: state.getIn(['header', 'chainName'])
 })
 
 const mapDispatch = (dispatch) => ({
     async setIsFirst(e) {
       dispatch(actionCreators.toggleIsFirst(e));
     }
 })
 
 export default connect(mapState, mapDispatch)(TableCellView);
