import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import adminStore from '../../admin/redux';

interface StoreProviderProps {
    children: React.ReactNode;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
    return (
        <ReduxProvider store={adminStore}>
            {children}
        </ReduxProvider>
    );
};