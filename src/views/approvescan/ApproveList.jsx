import React, { PureComponent } from 'react';
import { hexZeroPad, Interface,getAddress } from 'ethers/lib/utils';
import { providers,Contract } from 'ethers';
import TableCellView from './TableCellView'
import { ERC721Metadata } from '../../config/abis';
import { getLogs, getTokenType, isVerified, toFloat, getExplorerUrl} from '../../utils/tools';
import { getTokenData } from '../../utils/ERC20/util';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Link from '@mui/material/Link';
import { connect } from 'react-redux';
import { ERC20 } from '../../config/abis';

const filterUnverifiedTokens = true;
const filterZeroBalances = true;

class ApproveList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {inputAddress: "", tokenComponents: []}
  }
 
componentDidUpdate(){
  const {inputAddress} = this.state
  if(inputAddress !== this.props.inputAddress) {
     this.loadData();
 
  }
}

async loadData (){
  var arr = {
    chainId: this.props.chainId,
    tokenMapping: undefined,
    provider : new providers.Web3Provider(this.props.walletProvider ? this.props.walletProvider : window.ethereum),
  }
  const { chainId, provider, tokenMapping } = arr;
  try {
    if (!this.props.inputAddress) return;
    if (!provider || !chainId) return;
   
    const erc721Interface = new Interface(ERC721Metadata);
    const latestBlockNumber = await provider.getBlockNumber();
    const transferFilter = {
      topics: [erc721Interface.getEventTopic('Transfer'), undefined, hexZeroPad(this.props.inputAddress, 32)],
    };
    const transferEvents = await getLogs(provider, transferFilter, 0, latestBlockNumber, chainId);

    const approvalFilter = {
      topics: [erc721Interface.getEventTopic('Approval'), hexZeroPad(this.props.inputAddress, 32)],
    };
    const approvalEvents = await getLogs(provider, approvalFilter, 0, latestBlockNumber, chainId);
    

    const filteredApprovalEvents = approvalEvents.filter((ev) => ev.topics.length === 3);
    const filteredTransferEvents = transferEvents.filter((ev) => ev.topics.length === 3);
    const allEvents = [...filteredApprovalEvents, ...filteredTransferEvents];

    const tokenContracts = allEvents
      .filter((event, i) => i === allEvents.findIndex((other) => event.address === other.address))
      .map((event) => new Contract(getAddress(event.address), ERC20, provider));

    const unsortedTokens = await Promise.all(
      tokenContracts.map(async (contract) => {
        const tokenApprovals = approvalEvents.filter((approval) => approval.address === contract.address);
        const verified = isVerified(contract.address, tokenMapping);
        const tokenType = getTokenType(chainId);
        try {
          const tokenData = await getTokenData(contract, this.props.inputAddress, tokenMapping);
          return { ...tokenData, tokenType, contract, verified, approvals: tokenApprovals };
        } catch {
          return undefined;
        }
      })
    );

    const hasBalanceOrApprovals = (token) =>
      token.approvals.length > 0 || toFloat(Number(token.balance), token.decimals) !== '0.000';

    const sortedTokens = unsortedTokens
      .filter((token) => token !== undefined)
      .filter(hasBalanceOrApprovals)
      .sort((a, b) => a.symbol.localeCompare(b.symbol));

    var tokens = sortedTokens
    const tokenComponents = tokens
    .filter((token) => !filterUnverifiedTokens || token.verified)
    .filter((token) => !filterZeroBalances || !(toFloat(Number(token.balance), token.decimals) === '0.000'))


    tokenComponents.forEach(async (token, key) =>{
      tokenComponents[key].explorerUrl =  `${getExplorerUrl(chainId)}/address/${token.contract.address}`
    })

    this.setState({
      inputAddress: this.props.inputAddress,
      tokenComponents: tokenComponents
    })
    const { handleClose } = this.props;
    handleClose();

  } catch (e) {
    console.log(e);
  }
}


  render() {
    const { tokenComponents} = this.state
    return (
      <TableBody>   
        {tokenComponents.map((token, index) => (
            <TableRow key={token.contract.address+this.props.inputAddress+index}>
                 <TableCell><Link href={token.explorerUrl}>{token.symbol}</Link></TableCell>
                 <TableCell align="right">{token.tokenType}</TableCell>
                 <TableCell align="right">{toFloat(Number(token.balance), token.decimals)}</TableCell>
                 <TableCellView token={token} inputAddress={this.props.inputAddress}/>      
           </TableRow>
              )
          )
       }
      </TableBody>
  )
   
  }
}

const mapState = (state) => ({
  walletProvider: state.getIn(['header', 'walletProvider']),
  account: state.getIn(['header', 'account']),
  chainId: state.getIn(['header', 'chainId']),
  chainName: state.getIn(['header', 'chainName'])
})

export default connect(mapState)(ApproveList);
// export default (ApproveList);