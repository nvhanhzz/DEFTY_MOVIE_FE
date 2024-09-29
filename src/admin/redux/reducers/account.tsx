import { SET_CURRENT_ACCOUNT, Account } from "../actions/account";

export interface accountState {
    account: Account | null
}

const initialState: accountState | null = null;

const accountReducer = (state = initialState, action: { type: string; account: Account | null }): accountState | null => {
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