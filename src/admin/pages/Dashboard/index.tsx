import React from 'react';
import { useTranslation } from 'react-i18next';

const Dashboard: React.FC = () => {
    const { t } = useTranslation();

    return (
        <>
            <h1>{t('admin.dashboard.title')}</h1>
        </>
    );
}

export default Dashboard;