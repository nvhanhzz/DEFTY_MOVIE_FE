import { useDispatch as useReduxDispatch } from 'react-redux';
import { AdminDispatch } from '../../admin/redux';
import { ClientDispatch } from '../../client/redux';
import { useLocation } from 'react-router-dom';

const PREFIX_URL_ADMIN: string = import.meta.env.VITE_PREFIX_URL_ADMIN as string;

export const useAppDispatch = () => {
    const location = useLocation();
    const isAdmin = location.pathname.startsWith(PREFIX_URL_ADMIN);
    const dispatch = useReduxDispatch();

    return isAdmin ? (dispatch as AdminDispatch) : (dispatch as ClientDispatch);
};