import Title from 'antd/es/typography/Title';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Dashboard: React.FC = () => {
    const { t } = useTranslation();

    return (
        <>
            <Title level={2}>{t('admin.dashboard.title')}</Title>
        </>
    );
}

export default Dashboard;