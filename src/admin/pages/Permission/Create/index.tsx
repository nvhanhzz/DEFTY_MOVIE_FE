import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface Permission {
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
            // Gửi yêu cầu tạo quyền đến API
            console.log('Creating Permission:', values);
            // Gọi API thực tế ở đây
            message.success(t('admin.permission.createPermissionSuccessMessage'));
            navigate('/permissions'); // Điều hướng về trang danh sách quyền
        } catch (error) {
            message.error(t('admin.permission.errorPermissionMessage'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form onFinish={handleCreatePermission} layout="vertical">
            <h1>{t('admin.permission.create.title')}</h1>
            <Form.Item
                label={t('admin.permission.create.permissionName')}
                name="name"
                rules={[{ required: true, message: t('admin.permission.create.messageRequire') }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label={t('admin.permission.create.description')}
                name="description"
                rules={[{ required: true, message: t('admin.permission.create.messageRequire') }]}
            >
                <Input.TextArea />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    {t('admin.permission.create.createPermissionButton')}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default CreatePermission;