import React from 'react';
import { useLocation } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import adminStore from '../../admin/redux';
import clientStore from '../../client/redux';

interface StoreProviderProps {
    children: React.ReactNode;
}

const PREFIX_URL_ADMIN: string = import.meta.env.VITE_PREFIX_URL_ADMIN as string;

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
    const location = useLocation();
    const isAdmin = location.pathname.startsWith(PREFIX_URL_ADMIN);

    const store = isAdmin ? adminStore : clientStore;

    return (
        <ReduxProvider store={store}>
            {children}
        </ReduxProvider>
    );
};