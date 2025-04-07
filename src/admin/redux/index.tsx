import { combineReducers, createStore } from 'redux';
import accountReducer, { accountState } from './reducers/account';
import alertReducer, { AlertState } from './reducers/alert';

export interface AdminRootState {
    currentAccount: accountState;
    alert: AlertState
}

const rootReducer = combineReducers({
    currentAccount: accountReducer,
    alert: alertReducer
});

const adminStore = createStore(rootReducer);

export type AdminDispatch = typeof adminStore.dispatch;
export default adminStore;