import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../../shared/components/LanguageSwitcher';

const Dashboard: React.FC = () => {
    const { t } = useTranslation();

    return (
        <>
            <LanguageSwitcher />
            <h1>{t('dashboard.title')}</h1>
        </>
    );
}

export default Dashboard;