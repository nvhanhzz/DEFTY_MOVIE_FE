import React from 'react';
import { Breadcrumb, Row, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons'; // Icon mũi tên từ Ant Design
import "./Outlet.scss";

interface OutletTemplateProps {
    breadcrumbItems: { path: string; name: string }[];
    children: React.ReactNode;
}

const OutletTemplate: React.FC<OutletTemplateProps> = ({ breadcrumbItems, children }) => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <>
            <Row className="breadcrumb-container" style={{ marginTop: 20, marginBottom: 10, alignItems: 'center' }}>
                <Button
                    type="link"
                    icon={<ArrowLeftOutlined />}
                    onClick={handleBack}
                    style={{ marginRight: 10, color: "#999" }}
                >
                </Button>

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