import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from 'antd';
import LanguageSwitcher from '../../../shared/components/LanguageSwitcher';
import './Setting.scss';

const { Title, Text } = Typography;

const Setting: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="setting-page">
            <Title level={2} className="setting-page__title">
                {t('admin.setting.title')}
            </Title>

            <div className="setting-page__language">
                <Text strong className="setting-page__language--title">
                    {t('admin.setting.language')}
                </Text>
                <LanguageSwitcher />
            </div>
        </div >
    );
};

export default Setting;