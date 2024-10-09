import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Dropdown, MenuProps } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import './LanguageSwitcher.scss';

const LanguageSwitcher: React.FC = () => {
    const { i18n, t } = useTranslation();

    const languages = [
        { key: 'en', label: 'English' },
        { key: 'vi', label: 'Tiếng Việt' },
    ];

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng).then(() => {
        }).catch(() => {
        });
    };

    const menuItems: MenuProps['items'] = languages.map(lang => ({
        key: lang.key,
        label: lang.label,
        onClick: () => changeLanguage(lang.key),
    }));

    return (
        <Dropdown
            menu={{ items: menuItems }}
            trigger={['click']}
            placement="bottomRight"
        >
            <Button icon={<GlobalOutlined />}>
                {languages.find(lang => lang.key === i18n.language)?.label || t('admin.setting.language.select')}
            </Button>
        </Dropdown>
    );
};

export default LanguageSwitcher;