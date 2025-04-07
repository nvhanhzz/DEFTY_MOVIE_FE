import { useDispatch as useReduxDispatch } from 'react-redux';
import { AdminDispatch } from '../../admin/redux';

export const useAdminDispatch = () => {
    return useReduxDispatch<AdminDispatch>();
};