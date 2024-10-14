import React, { useState } from 'react';
import { Button, Form, Input, message, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './CreateRole.scss';
import OutletTemplate from '../../../templates/Outlet';
import { createRole } from '../../../services/roleSevice';

const PREFIX_URL_ADMIN: string = import.meta.env.VITE_PREFIX_URL_ADMIN as string;

const CreateRole: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState<boolean>(false); // Trạng thái loading

    const handleCreateRole = async (role: { name: string; description: string }) => {
        setIsLoading(true); // Bắt đầu loading
        try {
            const response = await createRole(role);
            if (!response.ok) {
                const result = await response.json();
                message.error(result.message || t('admin.role.create.createRoleErrorMessage')); // Hiển thị thông báo lỗi nếu có
                return;
            }
            const result = await response.json();
            if (result.status !== 201) {
                message.error(result.message || t('admin.role.create.createRoleErrorMessage')); // Hiển thị thông báo lỗi nếu có
                return;
            }
            message.success(t('admin.role.create.createRoleSuccessMessage'));
            navigate(`${PREFIX_URL_ADMIN}/roles`); // Chuyển hướng về trang danh sách Role
        } catch (error) {
            console.error("Error creating role:", error);
            message.error(t('admin.role.create.createRoleErrorMessage')); // Thông báo lỗi chung
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
                    label={t('admin.role.create.roleName')}
                    name="name"
                    rules={[{ required: true, message: t('admin.role.create.messageRequire') }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={t('admin.role.create.description')}
                    name="description"
                    rules={[{ required: true, message: t('admin.role.create.messageRequire') }]}
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
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <Spin tip={t('admin.role.create.loadingMessage')} /> {/* Hiển thị loading */}
                </div>
            )}
        </OutletTemplate>
    );
};

export default CreateRole;