import React, { useState } from 'react';
import { Button, Form, Input, message, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './CreateRole.scss';
import OutletTemplate from '../../../templates/Outlet';
import { createRole } from '../../../services/roleSevice';
import { LoadingOutlined } from '@ant-design/icons';

const PREFIX_URL_ADMIN: string = import.meta.env.VITE_PREFIX_URL_ADMIN as string;

const CreateRole: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState<boolean>(false); // Trạng thái loading

    const handleCreateRole = async (role: { name: string; description: string }) => {
        setIsLoading(true); // Bắt đầu loading
        try {
            const response = await createRole(role);
            const result = await response.json();
            if (!response.ok || result.status !== 201) {
                message.error(result.message || t('admin.message.createError')); // Hiển thị thông báo lỗi nếu có
                return;
            }
            message.success(t('admin.message.createSuccess')); // Thông báo tạo thành công
            navigate(`${PREFIX_URL_ADMIN}/roles`); // Chuyển hướng về trang danh sách Role
        } catch (error) {
            console.error("Error creating role:", error);
            message.error(t('admin.message.createError')); // Thông báo lỗi chung
        } finally {
            setIsLoading(false); // Kết thúc loading
        }
    };

    return (
        <OutletTemplate
            breadcrumbItems={[
                { path: `${PREFIX_URL_ADMIN}/dashboard`, name: t('admin.dashboard.title') },
                { path: `${PREFIX_URL_ADMIN}/roles`, name: t('admin.role.title') },
                { path: ``, name: t('admin.role.create.title') },
            ]}
        >
            <Form onFinish={handleCreateRole} layout="vertical">
                <Form.Item
                    label={t('admin.role.roleColumn')}
                    name="name"
                    rules={[{ required: true, message: t('admin.message.requiredMessage') }]} // Sử dụng thông báo yêu cầu chung
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={t('admin.role.descriptionColumn')}
                    name="description"
                    rules={[{ required: true, message: t('admin.message.requiredMessage') }]} // Sử dụng thông báo yêu cầu chung
                >
                    <Input.TextArea />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={isLoading}>
                        {t('admin.role.create.createRoleButton')}
                    </Button>
                </Form.Item>
            </Form>
            {isLoading && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '75vh' }}>
                    <Spin indicator={<LoadingOutlined spin />} />
                </div>
            )}
        </OutletTemplate>
    );
};

export default CreateRole;