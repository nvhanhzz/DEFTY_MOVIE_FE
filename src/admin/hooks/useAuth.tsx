import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { useAppDispatch } from '../../shared/hooks/useAppDispatch';
import { useEffect } from 'react';
import { getCurrentAdmin } from '../services/authService';
import { setCurrentUser } from '../../shared/redux/actions/currentUser';
import { getCookie } from '../../shared/utils/cookies';

export const useAuth = () => {
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector((state) => state.currentUser);

    useEffect(() => {
        const checkLoggedIn = async () => {
            const token = getCookie("adminToken");
            if (!token) {
                return;
            }

            const response = await getCurrentAdmin(token);
            if (response.status !== 200) {
                dispatch(setCurrentUser(null));
                return;
            }

            const result = await response.json();
            if (result.status !== 200) {
                dispatch(setCurrentUser(null));
                return;
            }
            dispatch(setCurrentUser(result.data));
        }

        checkLoggedIn();
    }, [dispatch, currentUser]);

    return currentUser !== null;
};