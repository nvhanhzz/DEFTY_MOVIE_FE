import React, { useState } from 'react';
import { Button, Avatar, Dropdown, MenuProps, Spin } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import './Header.scss';
import { postLogout } from '../../services/authService';
import { useAdminDispatch } from '../../hooks/useAdminDispatch';
import { setCurrentAccount } from '../../redux/actions/account';
import { addAlert } from '../../redux/actions/alert';

interface HeaderProps {
    collapsed: boolean;
    toggleCollapse: () => void;
}

const AppHeader: React.FC<HeaderProps> = ({ collapsed, toggleCollapse }) => {
    const { t } = useTranslation();
    const dispatch = useAdminDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false); // Thêm trạng thái loading

    const handleLogout = async () => {
        setIsLoading(true); // Bắt đầu loading
        const response = await postLogout();
        if (response.ok) {
            dispatch(setCurrentAccount(null));
            dispatch(addAlert(t('admin.logout.successTitle'), t('admin.logout.successMessage'), 5));
        }
        setIsLoading(false); // Kết thúc loading
    };

    const userMenuItems: MenuProps['items'] = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: t('admin.header.profile'),
        },
        {
            key: 'logout',
            icon: (
                <span className="logout-icon">
                    {isLoading ? <Spin size="small" /> : <LogoutOutlined />}
                </span>
            ),
            label: t('admin.header.logout'),
            onClick: isLoading ? undefined : handleLogout, // Ngăn không cho thực hiện khi đang loading
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