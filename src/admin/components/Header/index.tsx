import React from 'react';
import { Button, Avatar, Dropdown, MenuProps } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import './Header.scss';

interface HeaderProps {
    collapsed: boolean;
    toggleCollapse: () => void;
}

const AppHeader: React.FC<HeaderProps> = ({ collapsed, toggleCollapse }) => {
    const { t } = useTranslation();

    const handleLogout = () => {
        // Thêm logic cho việc logout
        console.log('Logged out');
    };

    // Tạo cấu trúc menu với kiểu dữ liệu phù hợp theo yêu cầu mới của Ant Design
    const userMenuItems: MenuProps['items'] = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: t('admin.header.profile'),
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: t('admin.header.logout'),
            onClick: handleLogout,
        },
    ];

    return (
        <div className="app-header">
            <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={toggleCollapse}
                className="collapse-button"
            />

            <Dropdown
                menu={{ items: userMenuItems }}
                trigger={['click']}
                placement="bottomRight"
            >
                <Avatar size="large" icon={<UserOutlined />} className="avatar-button" />
            </Dropdown>
        </div>
    );
};

export default AppHeader;