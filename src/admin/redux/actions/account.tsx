export const SET_CURRENT_ACCOUNT = 'SET_CURRENT_ACCOUNT';

export interface Account {
    _id: string,
    avatar: string,
    fullName: string,
    userName: string,
    email: string,
    phone: string
}

export const setCurrentAccount = (account: Account | null) => ({
    type: SET_CURRENT_ACCOUNT,
    account: account
});