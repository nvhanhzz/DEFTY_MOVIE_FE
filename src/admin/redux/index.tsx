import { combineReducers, createStore } from 'redux';
import CurrentUserReducer, { currentUserState } from '../../shared/redux/reducers/currentUser';

export interface AdminRootState {
    currentUser: currentUserState;
}

const rootReducer = combineReducers({
    currentUser: CurrentUserReducer,
});

const adminStore = createStore(rootReducer);

export type AdminDispatch = typeof adminStore.dispatch;
export default adminStore;