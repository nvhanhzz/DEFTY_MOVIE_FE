export const SET_CURRENT_ACCOUNT = 'SET_CURRENT_ACCOUNT';

export interface AccountRedux {
    id: string,
    avatar: string,
    fullName: string,
    username: string,
    email: string,
    phone: string,
    status: string,
    role: string,
    dateOfBirth: string,
    address: string,
    gender: string,
}

export const setCurrentAccount = (account: AccountRedux | null) => ({
    type: SET_CURRENT_ACCOUNT,
    account: account
});