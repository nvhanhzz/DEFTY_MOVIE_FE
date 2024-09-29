import { combineReducers, createStore } from 'redux';
import CurrentUserReducer, { currentUserState } from '../../shared/redux/reducers/currentUser';

export interface ClientRootState {
    currentUser: currentUserState;
}

const rootReducer = combineReducers({
    currentUser: CurrentUserReducer,
});

const clientStore = createStore(rootReducer);

export type ClientDispatch = typeof clientStore.dispatch;
export default clientStore;