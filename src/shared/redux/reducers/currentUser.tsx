import { SET_CURRENT_USER, User } from "../actions/currentUser";

export interface currentUserState {
    user: User
}

const initialState: currentUserState | null = null;

const CurrentUserReducer = (state = initialState, action: any): currentUserState | null => {
    switch (action.type) {
        case SET_CURRENT_USER:
            return {
                user: action.user
            };
        default:
            return state;
    }
}

export default CurrentUserReducer;