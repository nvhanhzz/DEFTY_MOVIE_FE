import React from 'react';
import { Breadcrumb, Row } from 'antd';
import { Link } from 'react-router-dom';
import "./Outlet.scss";

interface OutletTemplateProps {
    breadcrumbItems: { path: string; name: string }[];
    children: React.ReactNode;
}

const OutletTemplate: React.FC<OutletTemplateProps> = ({ breadcrumbItems, children }) => {
    return (
        <>
            <Row justify="space-between" className="breadcrumb-container" style={{ marginTop: 20, marginBottom: 10 }}>
                <Breadcrumb
                    items={breadcrumbItems.map((item) => ({
                        title: <Link to={item.path}>{item.name}</Link>,
                    }))}
                />
            </Row>
            <div className='outlet'>

                {children}
            </div>
        </>
    );
};

export default OutletTemplate;