import { useSelector as useReduxSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { AdminRootState } from '../../admin/redux';
import { ClientRootState } from '../../client/redux';

const PREFIX_URL_ADMIN: string = import.meta.env.VITE_PREFIX_URL_ADMIN as string;

export function useAppSelector<TSelected>(
    selector: (state: AdminRootState | ClientRootState) => TSelected
): TSelected {
    const location = useLocation();
    const isAdmin = location.pathname.startsWith(PREFIX_URL_ADMIN);

    if (isAdmin) {
        return useReduxSelector((state: AdminRootState) => selector(state));
    } else {
        return useReduxSelector((state: ClientRootState) => selector(state));
    }
}