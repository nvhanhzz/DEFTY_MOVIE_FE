import { SET_CURRENT_ACCOUNT, AccountRedux } from "../actions/accountRedux.tsx";

export interface accountState {
    account: AccountRedux | null
}

const initialState: accountState | null = null;

const accountReducer = (state = initialState, action: { type: string; account: AccountRedux | null }): accountState | null => {
    switch (action.type) {
        case SET_CURRENT_ACCOUNT:
            return {
                account: action.account
            };
        default:
            return state;
    }
}

export default accountReducer;

export class currentUserState {
}