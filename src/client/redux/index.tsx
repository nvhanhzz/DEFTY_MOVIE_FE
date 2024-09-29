import { combineReducers, createStore } from 'redux';
import CurrentUserReducer, { currentUserState } from '../../admin/redux/reducers/account';

export interface ClientRootState {
    currentUser: currentUserState;
}

const rootReducer = combineReducers({
    currentUser: CurrentUserReducer,
});

const clientStore = createStore(rootReducer);

export type ClientDispatch = typeof clientStore.dispatch;
export default clientStore;