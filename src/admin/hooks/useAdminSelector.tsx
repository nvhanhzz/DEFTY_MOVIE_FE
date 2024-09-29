import { useSelector as useReduxSelector } from 'react-redux';
import { AdminRootState } from '../../admin/redux';

export function useAdminSelector<TSelected>(
    selector: (state: AdminRootState) => TSelected
): TSelected {
    return useReduxSelector((state: AdminRootState) => selector(state));
}