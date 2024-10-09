import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Transfer, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Thêm hook i18n để dịch
import './UpdateRole.scss'; // Dùng chung CSS với trang tạo role

interface Permission {
    id: string;
    name: string;
    description: string;
}

const EditRole: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [selectedPermissions, setSelectedPermissions] = useState<React.Key[]>([]);
    const [role, setRole] = useState<{ name: string; description: string } | null>(null);
    const navigate = useNavigate();
    const { t } = useTranslation(); // Hook dịch

    useEffect(() => {
        const fetchPermissions = async () => {
            const perms = [
                { id: '1', name: 'Create', description: 'Permission to create new entries' },
                { id: '2', name: 'Read', description: 'Permission to read data' },
                { id: '3', name: 'Update', description: 'Permission to update existing entries' },
                { id: '4', name: 'Delete', description: 'Permission to delete entries' },
            ];
            setPermissions(perms);
        };

        const fetchRole = async () => {
            // Giả lập dữ liệu Role - thực tế bạn sẽ lấy từ API
            const fetchedRole = {
                name: 'Editor',
                description: 'Chỉnh sửa nội dung',
                permissions: ['2', '3'], // giả định các quyền hiện tại
            };
            setRole(fetchedRole);
            setSelectedPermissions(fetchedRole.permissions);
        };

        fetchPermissions();
        fetchRole();
    }, [id]);

    const handleUpdateRole = async (values: { name: string; description: string }) => {
        const updatedRole = { ...values, permissions: selectedPermissions };
        console.log('Updating Role:', updatedRole);
        // Gọi API để cập nhật Role (cần thực hiện API call tại đây)
        message.success(t('admin.role.update.updateRoleSuccessMessage')); // Sử dụng hook i18n để dịch
        navigate('/role');
    };

    if (!role) return <div>{t('admin.role.update.loadingMessage')}</div>; // Hiển thị khi đang tải dữ liệu

    return (
        <Form onFinish={handleUpdateRole} layout="vertical" initialValues={role}>
            <h1>{t('admin.role.update.title')}</h1>
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
            <Form.Item label={t('admin.role.update.permissionsLabel')} className="role-transfer">
                <Transfer
                    dataSource={permissions.map((perm) => ({
                        key: perm.id,
                        title: perm.name,
                        description: perm.description,
                    }))}
                    targetKeys={selectedPermissions}
                    onChange={(nextTargetKeys) => setSelectedPermissions(nextTargetKeys)}
                    render={item => (
                        <div className="transfer-item">
                            <div className="item-header">
                                <span className="permission-name">{item.title}</span>
                            </div>
                            <span className="permission-description">{item.description}</span>
                        </div>
                    )}
                />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    {t('admin.role.update.updateRoleButton')}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default EditRole;