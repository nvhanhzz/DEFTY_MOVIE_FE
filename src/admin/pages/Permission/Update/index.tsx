import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message, Spin } from 'antd';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getPermissionById, updatePermissionById } from '../../../services/permissionService';
import OutletTemplate from '../../../templates/Outlet';
import { LoadingOutlined } from '@ant-design/icons';

interface Permission {
    name: string;
    description: string;
}

const EditPermission: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [permission, setPermission] = useState<Permission | null>(null);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchPermission = async () => {
            try {
                const response = await getPermissionById(id as string);
                const result = await response.json();
                if (!response.ok || result.status !== 200) {
                    message.error(t('admin.message.fetchError')); // Sử dụng thông báo lỗi chung khi lấy dữ liệu
                    return;
                }
                setPermission(result.data);
            } catch (error) {
                message.error(t('admin.message.fetchError')); // Hiển thị thông báo lỗi khi không lấy được dữ liệu
            }
        };

        fetchPermission();
    }, [id, t]);

    const handleUpdatePermission = async (values: Permission) => {
        setLoading(true);
        try {
            const response = await updatePermissionById(id as string, values);
            if (response.ok) {
                message.success(t('admin.message.updateSuccess')); // Thông báo thành công
            } else {
                const result = await response.json();
                message.error(result.message || t('admin.message.updateError')); // Thông báo lỗi
            }
        } catch (error) {
            message.error(t('admin.message.updateError')); // Hiển thị lỗi khi có lỗi xảy ra trong quá trình cập nhật
        } finally {
            setLoading(false);
        }
    };

    return (
        <OutletTemplate
            breadcrumbItems={[
                { path: `${import.meta.env.VITE_PREFIX_URL_ADMIN}/dashboard`, name: t('admin.dashboard.title') },
                { path: `${import.meta.env.VITE_PREFIX_URL_ADMIN}/permissions`, name: t('admin.permission.title') },
                { path: ``, name: t('admin.permission.create.title') },
            ]}
        >
            {!permission ?
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '75vh' }}>
                    <Spin indicator={<LoadingOutlined spin />} />
                </div> :
                <Form onFinish={handleUpdatePermission} layout="vertical" initialValues={permission}>
                    <Form.Item
                        label={t('admin.permission.update.permissionName')}
                        name="name"
                        rules={[{ required: true, message: t('admin.message.requiredMessage') }]} // Thông báo yêu cầu nhập chung
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label={t('admin.permission.update.description')}
                        name="description"
                        rules={[{ required: true, message: t('admin.message.requiredMessage') }]} // Thông báo yêu cầu nhập chung
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            {t('admin.permission.update.updatePermissionButton')}
                        </Button>
                    </Form.Item>
                </Form>
            }
        </OutletTemplate>
    );
};

export default EditPermission;