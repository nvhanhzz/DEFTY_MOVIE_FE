import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Transfer, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './CreateRole.scss';

interface Permission {
    id: string;
    name: string;
    description: string;
}

const CreateRole: React.FC = () => {
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [selectedPermissions, setSelectedPermissions] = useState<React.Key[]>([]);
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        // Giả lập dữ liệu quyền - thực tế bạn sẽ lấy từ API
        const fetchPermissions = async () => {
            const perms = [
                { id: '1', name: 'Create', description: 'Permission to create new entries' },
                { id: '2', name: 'Read', description: 'Permission to read data' },
                { id: '3', name: 'Update', description: 'Permission to update existing entries' },
                { id: '4', name: 'Delete', description: 'Permission to delete entries' },
            ];
            setPermissions(perms);
        };
        fetchPermissions();
    }, []);

    const handleCreateRole = async (values: { role: string; description: string }) => {
        // Gửi yêu cầu tạo Role đến API
        const newRole = { ...values, permissions: selectedPermissions };
        console.log('Creating Role:', newRole);
        // Gọi API để lưu Role (cần thực hiện API call tại đây)
        message.success(t('admin.role.create.createRoleSuccessMessage'));
        navigate('/role'); // Chuyển hướng về trang danh sách Role
    };

    return (
        <Form onFinish={handleCreateRole} layout="vertical">
            <h1>{t('admin.role.create.title')}</h1>
            <Form.Item
                label={t('admin.role.create.roleName')}
                name="role"
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
            <Form.Item label={t('admin.role.create.permissionsLabel')} className="role-transfer">
                <Transfer
                    dataSource={permissions.map((perm) => ({
                        key: perm.id,
                        title: perm.name,
                        description: perm.description,
                    }))}
                    targetKeys={selectedPermissions}
                    showSearch // Kích hoạt tìm kiếm
                    filterOption={(inputValue, item) =>
                        item.title.toLowerCase().includes(inputValue.toLowerCase()) ||
                        item.description.toLowerCase().includes(inputValue.toLowerCase()) // Lọc theo tên và mô tả
                    }
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
                    {t('admin.role.create.createRoleButton')}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default CreateRole;