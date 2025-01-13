import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { createMembershipPacket } from '../../../services/membershipPackageService.tsx';
import OutletTemplate from '../../../templates/Outlet';

const PREFIX_URL_ADMIN: string = import.meta.env.VITE_PREFIX_URL_ADMIN as string;

interface MembershipPacket {
    name: string;
    description: string;
    price: number;
    discount: number;
    duration: number;
}

const CreateMembershipPacket: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleCreatePermission = async (values: MembershipPacket) => {
        setLoading(true);
        try {
            const response = await createMembershipPacket(values);
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
            navigate(`${PREFIX_URL_ADMIN}/membership-packets`); // Điều hướng về trang danh sách quyền
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
                { path: `${PREFIX_URL_ADMIN}/membership-packets`, name: t('admin.membership-packet.title') },
                { path: ``, name: t('admin.membership-packet.create.title') },
            ]}
        >
            <Form onFinish={handleCreatePermission} layout="vertical">
                <Form.Item
                    label={t('admin.membership-packet.create.membership-packetName')}
                    name="name"
                    rules={[{ required: true, message: t('admin.message.requiredMessage') }]} // Sử dụng thông báo yêu cầu chung từ admin.message
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={t('admin.membership-packet.create.price')}
                    name="price"
                    rules={[{ required: true, message: t('admin.message.requiredMessage') }]} // Sử dụng thông báo yêu cầu chung từ admin.message
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={t('admin.membership-packet.create.discount')}
                    name="discount"
                    rules={[{ required: true, message: t('admin.message.requiredMessage') }]} // Sử dụng thông báo yêu cầu chung từ admin.message
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={t('admin.membership-packet.create.duration')}
                    name="duraton"
                    rules={[{ required: true, message: t('admin.message.requiredMessage') }]} // Sử dụng thông báo yêu cầu chung từ admin.message
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={t('admin.membership-packet.create.description')}
                    name="description"
                    rules={[{ required: true, message: t('admin.message.requiredMessage') }]} // Sử dụng thông báo yêu cầu chung từ admin.message
                >
                    <Input.TextArea />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        {t('admin.membership-packet.create.createPermissionButton')}
                    </Button>
                </Form.Item>
            </Form>
        </OutletTemplate>
    );
};

export default CreateMembershipPacket;