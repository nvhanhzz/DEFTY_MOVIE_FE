import { useAdminDispatch } from './useAdminDispatch';
import { useAdminSelector } from './useAdminSelector';
import { useEffect } from 'react';
import { getCurrentAdmin } from '../services/authService';
import { setCurrentAccount } from '../redux/actions/account';
import { getCookie } from '../../shared/utils/cookies';

export const useAuth = () => {
    const dispatch = useAdminDispatch();
    const currentUser = useAdminSelector((state) => state.currentAccount);

    useEffect(() => {
        const checkLoggedIn = async () => {
            const token = getCookie("adminToken");
            if (!token) {
                return;
            }

            const response = await getCurrentAdmin(token);
            if (response.status !== 200) {
                dispatch(setCurrentAccount(null));
                return;
            }

            const result = await response.json();
            if (result.status !== 200) {
                dispatch(setCurrentAccount(null));
                return;
            }
            dispatch(setCurrentAccount(result.data));
        }

        checkLoggedIn();
    }, [dispatch, currentUser]);

    return currentUser !== null;
};