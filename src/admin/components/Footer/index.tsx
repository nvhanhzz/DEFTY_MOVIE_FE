import React from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;

const AppFooter: React.FC = () => {
    return (
        <Footer style={{
            textAlign: 'center',
            padding: 25,
            fontSize: 14,
        }}>
            © {new Date().getFullYear()} DEFTY Company. All Rights Reserved.
        </Footer>
    );
};

export default AppFooter;
