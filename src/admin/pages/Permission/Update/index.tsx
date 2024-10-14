import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Title from 'antd/es/typography/Title';

interface Permission {
    name: string;
    description: string;
}

const EditPermission: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [permission, setPermission] = useState<Permission | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        const fetchPermission = async () => {
            // Giả lập dữ liệu quyền - thực tế bạn sẽ lấy từ API
            const fetchedPermission = {
                name: 'Read',
                description: 'Permission to read data',
            };
            setPermission(fetchedPermission);
        };

        fetchPermission();
    }, [id]);

    const handleUpdatePermission = async (values: Permission) => {
        setLoading(true);
        try {
            // Gửi yêu cầu cập nhật quyền đến API
            console.log('Updating Permission:', values);
            // Gọi API thực tế ở đây
            message.success(t('admin.permission.updatePermissionSuccessMessage'));
            navigate('/permissions'); // Điều hướng về trang danh sách quyền
        } catch (error) {
            message.error(t('admin.permission.errorPermissionMessage'));
        } finally {
            setLoading(false);
        }
    };

    if (!permission) return <div>Loading...</div>; // Hiển thị khi đang tải dữ liệu

    return (
        <Form onFinish={handleUpdatePermission} layout="vertical" initialValues={permission}>
            <Title level={2}>{t('admin.permission.update.title')}</Title>
            <Form.Item
                label={t('admin.permission.update.permissionName')}
                name="name"
                rules={[{ required: true, message: t('admin.permission.update.messageRequire') }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label={t('admin.permission.update.description')}
                name="description"
                rules={[{ required: true, message: t('admin.permission.update.messageRequire') }]}
            >
                <Input.TextArea />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    {t('admin.permission.update.updatePermissionButton')}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default EditPermission;