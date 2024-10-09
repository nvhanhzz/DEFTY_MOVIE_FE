import React, { useState, useEffect } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Avatar, Space } from 'antd';
import { useMediaQuery } from 'react-responsive';

const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    // Sử dụng hook useMediaQuery để kiểm tra nếu màn hình nhỏ hơn 768px
    const isSmallScreen = useMediaQuery({ maxWidth: 768 });

    useEffect(() => {
        // Khi kích thước màn hình nhỏ, tự động gập sidebar
        if (isSmallScreen) {
            setCollapsed(true);
        }
    }, [isSmallScreen]);

    return (
        <Layout>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                breakpoint="md"
                onBreakpoint={(broken) => {
                    setCollapsed(broken);
                }}
                style={{ boxShadow: '2px 0 8px rgba(0, 0, 0, 0.15)' }}
            >
                <div className="demo-logo-vertical" style={{ padding: '16px', textAlign: 'center' }}>
                    <img
                        src="https://via.placeholder.com/120x40.png?text=LOGO"
                        alt="Logo"
                        style={{ maxWidth: '100%', height: 'auto' }}
                    />
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={[
                        {
                            key: '1',
                            icon: <UserOutlined />,
                            label: 'nav 1',
                        },
                        {
                            key: '2',
                            icon: <VideoCameraOutlined />,
                            label: 'nav 2',
                        },
                        {
                            key: '3',
                            icon: <UploadOutlined />,
                            label: 'nav 3',
                        },
                    ]}
                />
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: '0 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: colorBgContainer,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: '18px',
                                width: 48,
                                height: 48,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        />
                    </div>
                    <Space size="large">
                        <Avatar icon={<UserOutlined />} />
                        {/* <Text strong>User Name</Text> */}
                        <Button type="link" icon={<LogoutOutlined />} danger>
                            {/* Logout */}
                        </Button>
                    </Space>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    Content
                </Content>
            </Layout>
        </Layout>
    );
};

export default App;