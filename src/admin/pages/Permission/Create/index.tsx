import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { postPermission } from '../../../services/permissionService';
import OutletTemplate from '../../../templates/Outlet';

const PREFIX_URL_ADMIN: string = import.meta.env.VITE_PREFIX_URL_ADMIN as string;

export interface Permission {
    name: string;
    description: string;
}

const CreatePermission: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleCreatePermission = async (values: Permission) => {
        setLoading(true);
        try {
            const response = await postPermission(values);
            const result = await response.json();
            if (!response.ok) {
                // Hiển thị thông báo lỗi nếu phản hồi không thành công
                message.error(result.message || t('admin.message.createError')); // Sử dụng message chung từ admin.message
                return;
            }
            if (result.status !== 201) {
                // Thông báo lỗi nếu status không phải 201
                message.error(result.message || t('admin.message.createError')); // Sử dụng message chung từ admin.message
                return;
            }

            // Hiển thị thông báo thành công
            message.success(t('admin.message.createSuccess')); // Sử dụng message thành công từ admin.message
            navigate(`${PREFIX_URL_ADMIN}/permissions`); // Điều hướng về trang danh sách quyền
        } catch (error) {
            message.error(t('admin.message.fetchError')); // Sử dụng message lỗi khi gặp lỗi khác
        } finally {
            setLoading(false);
        }
    };

    return (
        <OutletTemplate
            breadcrumbItems={[
                { path: `${PREFIX_URL_ADMIN}/dashboard`, name: t('admin.dashboard.title') },
                { path: `${PREFIX_URL_ADMIN}/permissions`, name: t('admin.permission.title') },
                { path: ``, name: t('admin.permission.create.title') },
            ]}
        >
            <Form onFinish={handleCreatePermission} layout="vertical">
                <Form.Item
                    label={t('admin.permission.create.permissionName')}
                    name="name"
                    rules={[{ required: true, message: t('admin.message.requiredMessage') }]} // Sử dụng thông báo yêu cầu chung từ admin.message
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={t('admin.permission.create.description')}
                    name="description"
                    rules={[{ required: true, message: t('admin.message.requiredMessage') }]} // Sử dụng thông báo yêu cầu chung từ admin.message
                >
                    <Input.TextArea />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        {t('admin.permission.create.createPermissionButton')}
                    </Button>
                </Form.Item>
            </Form>
        </OutletTemplate>
    );
};

export default CreatePermission;