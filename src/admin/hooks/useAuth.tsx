import { useAdminDispatch } from './useAdminDispatch';
import { useAdminSelector } from './useAdminSelector';
import { useEffect } from 'react';
import { setCurrentAccount } from '../redux/actions/account';
import { setCurrentAccountHelper } from '../helpers/Account';

export const useAuth = () => {
    const dispatch = useAdminDispatch();
    const currentAccount = useAdminSelector((state) => state.currentAccount);

    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                const account = await setCurrentAccountHelper();

                dispatch(setCurrentAccount(account));
            } catch (error) {
                console.error("Error checking logged in status:", error);
                dispatch(setCurrentAccount(null));
            }
        };

        checkLoggedIn();
    }, [dispatch]);

    return currentAccount && currentAccount.account !== null;
};