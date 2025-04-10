import React, { useEffect, useState } from 'react';
import { Layout, Menu, Input } from 'antd';
import {
    SettingOutlined,
    CameraOutlined,
    DashboardOutlined,
    GiftOutlined,
    IdcardOutlined,
    KeyOutlined,
    VideoCameraOutlined,
    ReadOutlined,
    SafetyOutlined,
    TagsOutlined,
    TeamOutlined,
    UserOutlined,
    HomeOutlined,
    AppstoreAddOutlined,
    ControlOutlined,
    ProductOutlined
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
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
    subMenu?: MenuItem[];
}

const menuItems: MenuItem[] = [
    {
        icon: <DashboardOutlined />,
        label: 'admin.dashboard.title',
        linkTo: 'dashboard',
    },
    {
        icon: <ProductOutlined />,
        label: 'admin.common.content',
        linkTo: '',
        subMenu: [
            {
                icon: <VideoCameraOutlined />,
                label: 'admin.movie.title',
                linkTo: 'movies',
            },
            {
                icon: <TagsOutlined />,
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
                icon: <ReadOutlined />,
                label: 'admin.article.title',
                linkTo: 'articles',
            },
        ],
    },
    {
        icon: <ControlOutlined />,
        label: 'admin.common.configurations',
        linkTo: '',
        subMenu: [
            {
                icon: <HomeOutlined />,
                label: 'admin.homeConfig.title',
                linkTo: 'home-config',
            },
            {
                icon:  <AppstoreAddOutlined />,
                label: 'admin.banner.title',
                linkTo: 'banners',
            },
            {
                icon: <GiftOutlined />,
                label: 'admin.membership-packet.title',
                linkTo: 'membership-packets',
            },
        ]
    },
    {
        icon: <SettingOutlined />,
        label: 'admin.common.system',
        linkTo: '',
        subMenu: [
            {
                icon: <UserOutlined />,
                label: 'admin.account.title',
                linkTo: 'accounts',
            },
            {
                icon: <TeamOutlined />,
                label: 'admin.user.title',
                linkTo: 'users',
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
        ],
    },
];

const AppSider: React.FC<SiderProps> = ({ collapsed }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    const [selectedKey, setSelectedKey] = useState<string>('1');
    const [filteredItems, setFilteredItems] = useState<any[]>([]);
    const [searchValue, setSearchValue] = useState<string>('');

    useEffect(() => {
        // Initialize filtered items
        setFilteredItems(generateMenuItems(menuItems));
    }, []);

    useEffect(() => {
        if (searchValue.trim() === '') {
            setFilteredItems(generateMenuItems(menuItems));
        } else {
            const lowerSearchValue = searchValue.toLowerCase();
            const filterMenu = (menu: any[]) =>
                menu
                    .map(item => {
                        if (item.children) {
                            const filteredChildren: MenuItem[] = filterMenu(item.children);
                            if (filteredChildren.length > 0) {
                                return { ...item, children: filteredChildren };
                            }
                        }
                        if (t(item.label).toLowerCase().includes(lowerSearchValue)) {
                            return item;
                        }
                        return null;
                    })
                    .filter(Boolean);
            setFilteredItems(filterMenu(generateMenuItems(menuItems)));
        }
    }, [searchValue, t]);

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

    const generateMenuItems = (menus: MenuItem[]) =>
        menus.map((item, index) => {
            if (item.subMenu) {
                return {
                    key: index.toString(),
                    icon: item.icon,
                    label: t(item.label),
                    children: item.subMenu.map((subItem, subIndex) => ({
                        key: `${index}-${subIndex}`,
                        icon: subItem.icon,
                        label: t(subItem.label),
                        onClick: () => handleItemClick(subItem.linkTo, `${index}-${subIndex}`),
                    })),
                };
            }
            return {
                key: index.toString(),
                icon: item.icon,
                label: t(item.label),
                onClick: () => handleItemClick(item.linkTo, index.toString()),
            };
        });

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
            <div className="logo" onClick={handleLogoClick}>
                <img
                    src="https://res.cloudinary.com/drsmkfjfo/image/upload/v1743307674/89c2f178-6765-4d8a-ba07-d630633b0e31_defty.png"
                    alt="Logo"
                    className="logo-img"
                />
                {!collapsed && <span className="logo-text">DEFTY MOVIE</span>}
            </div>
            {!collapsed && (
                <div className="search-bar">
                    <Input.Search
                        placeholder={"SearchResult ..."}
                        allowClear
                        onChange={e => setSearchValue(e.target.value)}
                        value={searchValue}
                        style={{ marginBottom: 16, padding: '0 16px' }}
                    />
                </div>
            )}
            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[selectedKey]}
                items={filteredItems}
            />
        </Sider>
    );
};

export default AppSider;
