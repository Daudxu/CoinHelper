
import { Component } from "react";
import { HashRouter as Router, Routes, Route} from "react-router-dom";

import Home from "./views/home";
import Tokentools from "./views/tokentools";
import Nfttools from "./views/nfttools";
import Approvescan from "./views/approvescan";
import Airdrop from "./views/tokentools/airdrop";
import Gather from "./views/tokentools/gather";
import Approve from "./views/tokentools/approve";
import TokenBalanceQuery from "./views/tokentools/tokenBalanceQuery";
import Herder from "./common/header";
import Curve from "./views/curve";
import Token from "./views/curve/Token";
import RewardToken from "./views/curve/RewardToken";
import TokenSnapshot from "./views/curve/tokenSnapshot";
import Uniswap from "./views/uniswap";
import Evm from "./views/evm";

import { Provider } from'react-redux';
import store from "./store";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router basename="/">
        <Herder />
           <Routes>
              <Route path="/" element={<Home />} />
              <Route path="tokentools" element={<Tokentools />} />
              <Route path="tokentools/airdrop" element={<Airdrop />} />
              <Route path="tokentools/gather" element={<Gather />} />
              <Route path="tokentools/token-approve" element={<Approve />} />
              <Route path="tokentools/token-balance-query" element={<TokenBalanceQuery />} />
              <Route path="nfttools" element={<Nfttools />} />
              <Route path="approve-scan" element={<Approvescan />} />
              <Route path="curve" element={<Curve />} />
              <Route path="curve/Token" element={<Token />} />
              <Route path="curve/RewardToken" element={<RewardToken />} />
              <Route path="curve/tokenSnapshot" element={<TokenSnapshot />} />
              <Route path="uniswap" element={<Uniswap />} />
              <Route path="evm" element={<Evm />} />
           </Routes>
        </Router>
     </Provider>
    )
  }
}


export default App;

