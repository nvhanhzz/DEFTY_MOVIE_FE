import React, { useState } from 'react';
import { Button, Avatar, Dropdown, MenuProps, Spin } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import './Header.scss';
import { postLogout } from '../../services/authService';
import { useAdminDispatch } from '../../hooks/useAdminDispatch';
import { setCurrentAccount } from '../../redux/actions/account';
import { addAlert } from '../../redux/actions/alert';
import {useAdminSelector} from "../../hooks/useAdminSelector.tsx";
import {useNavigate} from "react-router-dom";

interface HeaderProps {
    collapsed: boolean;
    toggleCollapse: () => void;
}

const AppHeader: React.FC<HeaderProps> = ({ collapsed, toggleCollapse }) => {
    const { t, i18n } = useTranslation();
    const dispatch = useAdminDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const currentAccount = useAdminSelector((state) => state.currentAccount.account);

    const handleLogout = async () => {
        setIsLoading(true);
        const response = await postLogout();
        if (response.ok) {
            dispatch(setCurrentAccount(null));
            dispatch(addAlert(t('admin.logout.successTitle'), t('admin.logout.successMessage'), 5));
        }
        setIsLoading(false);
    };

    const handleLanguageChange = (lang: string) => {
        i18n.changeLanguage(lang);
    };

    const userMenuItems: MenuProps['items'] = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: t('admin.header.profile'),
            onClick: () => {navigate("/admin/profile")}
        },
        {
            key: 'logout',
            icon: (
                <span className="logout-icon">
                    {isLoading ? <Spin size="small" /> : <LogoutOutlined />}
                </span>
            ),
            label: t('admin.header.logout'),
            onClick: isLoading ? undefined : handleLogout,
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

            <div className="header-right">
                <div className="language-switcher">
                    <img
                        src="/assets/images/English.png"
                        alt="English"
                        className="language-flag"
                        onClick={() => handleLanguageChange('en')}
                    />
                    <img
                        src="/assets/images/VN.jpg"
                        alt="Vietnamese"
                        className="language-flag"
                        onClick={() => handleLanguageChange('vi')}
                    />
                </div>

                <Dropdown
                    menu={{items: userMenuItems}}
                    trigger={['click']}
                    placement="bottomRight"
                >
                    <Avatar
                        size="large"
                        src={currentAccount?.avatar || undefined} // Hiển thị avatar nếu có
                        icon={!currentAccount?.avatar ? <UserOutlined /> : null} // Hiển thị icon nếu không có avatar
                        className="avatar-button"
                    />
                </Dropdown>
            </div>

        </div>
    );
};

export default AppHeader;
