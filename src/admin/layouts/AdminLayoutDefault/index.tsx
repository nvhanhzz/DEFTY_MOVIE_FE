import React, { useState, useEffect } from 'react';
import { Layout, theme } from 'antd';
import { Outlet } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import AppSider from '../../components/Sider';
import AppHeader from '../../components/Header';
import './AdminLayoutDefault.scss';

const { Content } = Layout;

const AdminLayoutDefault: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    useEffect(() => {
        if (isMobile) {
            setCollapsed(true);
        } else {
            setCollapsed(false);
        }
    }, [isMobile]);

    // Chiều rộng của Sider phụ thuộc vào trạng thái collapsed
    const siderWidth = collapsed ? 80 : 200;

    return (
        <Layout className="main-layout">
            <AppSider collapsed={collapsed} />
            <Layout
                className={`site-layout ${collapsed ? 'collapsed' : ''}`}
                style={{
                    marginLeft: siderWidth,
                }}
            >
                <AppHeader
                    collapsed={collapsed}
                    toggleCollapse={() => setCollapsed(!collapsed)}
                />
                <Content
                    className="site-content"
                    style={{
                        marginTop: 30,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayoutDefault;