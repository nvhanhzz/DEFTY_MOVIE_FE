import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import { DashboardOutlined, SettingOutlined, SafetyOutlined, KeyOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sider.scss';
import { useTranslation } from 'react-i18next';

const PREFIX_URL_ADMIN: string = import.meta.env.VITE_PREFIX_URL_ADMIN as string;

const { Sider } = Layout;

interface SiderProps {
    collapsed: boolean;
}

interface MenuItem {
    key: string;
    icon: React.ReactNode;
    label: string;
    linkTo: string;
}

const menuItems: MenuItem[] = [
    {
        key: '1',
        icon: <DashboardOutlined />,
        label: 'admin.dashboard.title',
        linkTo: 'dashboard',
    },
    {
        key: '2',
        icon: <SafetyOutlined />,
        label: 'admin.role.title',
        linkTo: 'roles',
    },
    {
        key: '3',
        icon: <KeyOutlined />,
        label: 'admin.permission.title',
        linkTo: 'permissions',
    },
    {
        key: '4',
        icon: <SettingOutlined />,
        label: 'admin.setting.title',
        linkTo: 'settings',
    },
];

const AppSider: React.FC<SiderProps> = ({ collapsed }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    const [selectedKey, setSelectedKey] = useState<string>('1');

    useEffect(() => {
        const matchingItem = menuItems.find(item => item.linkTo === location.pathname.split('/')[2]);
        if (matchingItem) {
            setSelectedKey(matchingItem.key);
        }
    }, [location.pathname]);

    const handleItemClick = (path: string, key: string) => {
        navigate(`${PREFIX_URL_ADMIN}/${path}`);
        setSelectedKey(key);
    };

    const handleLogoClick = () => {
        navigate(`${PREFIX_URL_ADMIN}`);
        setSelectedKey('1');
    };

    const items = menuItems.map(item => ({
        key: item.key,
        icon: item.icon,
        label: t(item.label),
        onClick: () => handleItemClick(item.linkTo, item.key),
    }));

    return (
        <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            className="app-sider"
            width={250}
            collapsedWidth={80}
            style={{
                width: collapsed ? 80 : 250,
                minWidth: collapsed ? 80 : 250,
                maxWidth: collapsed ? 80 : 250,
                transition: 'width 0.2s',
            }}
        >
            <div className="logo" onClick={handleLogoClick}></div>
            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[selectedKey]}
                items={items}
            />
        </Sider>
    );
};

export default AppSider;