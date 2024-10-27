import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message, Popconfirm, Spin } from 'antd';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import OutletTemplate from '../../../templates/Outlet';
import { Permission } from '../../Permission';
import './UpdateRole.scss';
import { getRoleById, updateRoleById } from '../../../services/roleSevice';
import { Role } from "..";
import { getPermissions } from '../../../services/permissionService';
import CustomTransfer from '../../../components/CustomTransfer';
import { LoadingOutlined } from '@ant-design/icons';

const EditRole: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([]);
    const [role, setRole] = useState<Role | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { t } = useTranslation();
    const [form] = Form.useForm();

    useEffect(() => {
        // Fetch role details by ID
        const fetchRole = async () => {
            if (id) {
                try {
                    const response = await getRoleById(id);
                    if (response.ok) {
                        const result = await response.json();
                        if (result.status === 200) {
                            setRole(result.data);
                            form.setFieldsValue({
                                name: result.data.name,
                                description: result.data.description
                            });
                            setSelectedPermissions(result.data.rolePermissions);
                        } else {
                            message.error(t('admin.message.fetchError'));
                        }
                    }
                } catch (error) {
                    message.error(t('admin.message.fetchError'));
                }
            }
        };

        // Fetch all permissions
        const fetchPermissions = async () => {
            try {
                const response = await getPermissions();
                if (response.ok) {
                    const result = await response.json();
                    if (result.status === 200) {
                        const listPermission: Permission[] = result.data.content.map((item: Permission) => ({
                            ...item,
                            key: item.id.toString(),
                        }));
                        setPermissions(listPermission);
                    } else {
                        message.error(t('admin.message.fetchError'));
                    }
                }
            } catch (error) {
                message.error(t('admin.message.fetchError'));
            }
        };

        fetchRole();
        fetchPermissions();
    }, [id, t, form]);

    const handleUpdateRole = async (values: any) => {
        setIsSubmitting(true);
        try {
            const response = await updateRoleById(id as string, { ...values, rolePermissions: selectedPermissions });
            if (response.ok) {
                message.success(t('admin.message.updateSuccess'));
            } else {
                message.error(t('admin.message.updateError'));
            }
        } catch (error) {
            message.error(t('admin.message.updateError'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <OutletTemplate
            breadcrumbItems={[
                { path: `${import.meta.env.VITE_PREFIX_URL_ADMIN}/dashboard`, name: t('admin.dashboard.title') },
                { path: `${import.meta.env.VITE_PREFIX_URL_ADMIN}/roles`, name: t('admin.role.title') },
                { path: ``, name: t('admin.role.update.title') },
            ]}
        >
            {!role ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '75vh' }}>
                    <Spin indicator={<LoadingOutlined spin />} />
                </div>
            ) : (
                <>
                    <Form form={form} layout="vertical" initialValues={role} onFinish={handleUpdateRole}>
                        <Form.Item
                            label={t('admin.role.roleColumn')}
                            name="name"
                            rules={[{ required: true, message: t('admin.message.requiredMessage') }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label={t('admin.role.descriptionColumn')}
                            name="description"
                            rules={[{ required: true, message: t('admin.message.requiredMessage') }]}
                        >
                            <Input.TextArea />
                        </Form.Item>
                        <Form.Item>
                            <Popconfirm
                                title={t('admin.role.update.confirmUpdateMessage')}
                                onConfirm={form.submit}
                                okText={t('admin.message.assignPermissionConfirm')}
                                cancelText={t('admin.message.assignPermissionCancel')}
                            >
                                <Button type="primary" htmlType="submit" loading={isSubmitting}>
                                    {t('admin.role.update.updateRoleButton')}
                                </Button>
                            </Popconfirm>
                        </Form.Item>
                    </Form>

                    <CustomTransfer
                        dataSource={permissions}
                        target={selectedPermissions}
                        onChange={setSelectedPermissions}
                        roleId={id as string}
                    />
                </>
            )}
        </OutletTemplate>
    );
};

export default EditRole;