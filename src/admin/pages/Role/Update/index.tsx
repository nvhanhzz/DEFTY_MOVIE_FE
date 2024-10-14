import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message, Popconfirm, Spin } from 'antd';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import OutletTemplate from '../../../templates/Outlet';
import { Permission } from '../../Permission';
import './UpdateRole.scss';
import { getRoleById, updateRoleById } from '../../../services/roleSevice';
import { Role } from "..";
import { getAllPermission } from '../../../services/permissionService';
import CustomTransfer from '../../../components/CustomTransfer'; // Cập nhật đường dẫn nếu cần

const EditRole: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([]); // Thay đổi kiểu thành Permission[]
    const [role, setRole] = useState<Role | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { t } = useTranslation();
    const [form] = Form.useForm();

    useEffect(() => {
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
                            setSelectedPermissions(result.data.rolePermissions); // Lưu trữ quyền đầy đủ
                        } else {
                            message.error(t('admin.role.update.fetchRoleError'));
                        }
                    }
                } catch (error) {
                    message.error(t('admin.role.update.fetchRoleError'));
                }
            }
        };

        const fetchPermissions = async () => {
            try {
                const response = await getAllPermission();
                if (response.ok) {
                    const result = await response.json();
                    if (result.status === 200) {
                        const listPermission: Permission[] = result.data.map((item: Permission) => ({
                            ...item,
                            key: item.id.toString(),
                        }));
                        setPermissions(listPermission);
                    } else {
                        message.error(t('admin.role.update.fetchPermissionError'));
                    }
                }
            } catch (error) {
                message.error(t('admin.role.update.fetchPermissionError'));
            }
        };

        fetchRole();
        fetchPermissions();
    }, [id, t, form]);

    const handleUpdateRole = async (values: any) => {
        console.log("Updated Role Values: ", values);
        setIsSubmitting(true);
        if (role) {
            try {
                const response = await updateRoleById(id as string, { ...values, rolePermissions: selectedPermissions });
                console.log(response);
                if (response.ok) {
                    message.success(t('admin.role.update.successMessage'));
                } else {
                    message.error(t('admin.role.update.errorMessage'));
                }
            } catch (error) {
                message.error(t('admin.role.update.errorMessage'));
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    if (!role) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}> {/* Căn giữa spinner */}
            <Spin tip={t('admin.role.update.loadingMessage')} />
        </div>
    );

    return (
        <OutletTemplate
            breadcrumbItems={[
                { path: `${import.meta.env.VITE_PREFIX_URL_ADMIN}`, name: t('admin.dashboard.title') },
                { path: `${import.meta.env.VITE_PREFIX_URL_ADMIN}/roles`, name: t('admin.role.title') },
                { path: ``, name: t('admin.role.update.title') },
            ]}
        >
            <Form form={form} layout="vertical" initialValues={role} onFinish={handleUpdateRole}>
                <Form.Item
                    label={t('admin.role.update.roleName')}
                    name="name"
                    rules={[{ required: true, message: t('admin.role.update.messageRequire') }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={t('admin.role.update.description')}
                    name="description"
                    rules={[{ required: true, message: t('admin.role.update.messageRequire') }]}
                >
                    <Input.TextArea />
                </Form.Item>
                <Form.Item>
                    <Popconfirm
                        title={t('admin.role.update.confirmUpdateMessage')}
                        onConfirm={form.submit}
                        okText={t('admin.role.update.confirmYes')}
                        cancelText={t('admin.role.update.confirmNo')}
                    >
                        <Button type="primary" htmlType="submit" loading={isSubmitting}>
                            {t('admin.role.update.updateRoleButton')}
                        </Button>
                    </Popconfirm>
                </Form.Item>
            </Form>

            <CustomTransfer
                dataSource={permissions}
                target={selectedPermissions} // Truyền quyền đã chọn
                onChange={setSelectedPermissions} // Cập nhật selectedPermissions từ CustomTransfer
                roleId={id as string}
            />
        </OutletTemplate>
    );
};

export default EditRole;