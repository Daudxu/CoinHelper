import { fromJS } from 'immutable';
import * as constants from './constants';
const defaultState = fromJS({
    walletProvider: '',
    account: '',
    chainId: "",
    chainName: ""
});

const stateFn = (state = defaultState, action) => {
    switch (action.type) {
        case constants.WELLAT_PROVIDER:
            return state.set('walletProvider', action.walletProvider)
        case constants.WELLAT_ACCOUNT:
            return state.set('account', action.account)
        case constants.WELLAT_CHAINID:
            return state.set('chainId', action.chainId)
        case constants.WELLAT_CHAIN_NAME:
            return state.set('chainName', action.chainName)
        default:
            return state;
    }
};

export default stateFn;