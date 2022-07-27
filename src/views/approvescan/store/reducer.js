import { fromJS } from 'immutable';
import * as constants from './constants';
const defaultState = fromJS({
    isFirst: false
});

const stateFn = (state = defaultState, action) => {
    switch (action.type) {
        case constants.APPROVESCAN_IS_FIRST:
            return state.set('isFirst', action.isTrue)
        default:
            return state;
    }
};

export default stateFn;