import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import {
    DashboardOutlined,
    SettingOutlined,
    SafetyOutlined,
    KeyOutlined,
    ReadOutlined,
    UserOutlined,
    LinuxOutlined,
    CameraOutlined,
    TagsOutlined,
    IdcardOutlined,
    TeamOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sider.scss';
import { useTranslation } from 'react-i18next';

const PREFIX_URL_ADMIN: string = import.meta.env.VITE_PREFIX_URL_ADMIN as string;

const { Sider } = Layout;

interface SiderProps {
    collapsed: boolean;
}

interface MenuItem {
    icon: React.ReactNode;
    label: string;
    linkTo: string;
}

const menuItems: MenuItem[] = [
    {
        icon: <DashboardOutlined />,
        label: 'admin.dashboard.title',
        linkTo: 'dashboard',
    },
    {
        icon: <LinuxOutlined />,
        label: 'admin.movie.title',
        linkTo: 'movies',
    },
    {
        icon: <TagsOutlined  />,
        label: 'admin.category.title',
        linkTo: 'categories',
    },
    {
        icon: <CameraOutlined />,
        label: 'admin.director.title',
        linkTo: 'directors',
    },
    {
        icon: <IdcardOutlined />,
        label: 'admin.actor.title',
        linkTo: 'actors',
    },
    {
        icon: <UserOutlined />,
        label: 'admin.account.title',
        linkTo: 'accounts',
    },
    {
        icon: <SafetyOutlined />,
        label: 'admin.role.title',
        linkTo: 'roles',
    },
    {
        icon: <KeyOutlined />,
        label: 'admin.permission.title',
        linkTo: 'permissions',
    },
    {
        icon: <ReadOutlined />,
        label: 'admin.article.title',
        linkTo: 'articles',
    },
    {
        icon: <TeamOutlined />,
        label: 'admin.user.title',
        linkTo: 'users',
    },
    {
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
            setSelectedKey(menuItems.indexOf(matchingItem).toString());
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

    const items = menuItems.map((item, index) => ({
        key: index.toString(),
        icon: item.icon,
        label: t(item.label),
        onClick: () => handleItemClick(item.linkTo, index.toString()),
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