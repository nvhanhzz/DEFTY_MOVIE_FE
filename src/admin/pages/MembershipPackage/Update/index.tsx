import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message, Spin } from 'antd';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import OutletTemplate from '../../../templates/Outlet';
import { LoadingOutlined } from '@ant-design/icons';
import {getMembershipPacketById, updateMembershipPacketById} from "../../../services/membershipPackageService.tsx";
import {MembershipPackage} from "../index.tsx";

interface MembershipPacket {
    name: string;
    description: string;
    price: number;
    discount: number;
    duration: number;
}

const EditMembershipPacket: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [membershipPacket, setMembershipPacket] = useState<MembershipPacket | null>(null);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchMembershipPacket = async () => {
            try {
                const response = await getMembershipPacketById(id as string);
                const result = await response.json();
                if (!response.ok || result.status !== 200) {
                    message.error(t('admin.message.fetchError')); // Sử dụng thông báo lỗi chung khi lấy dữ liệu
                    return;
                }
                setMembershipPacket(result.data);
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                message.error(t('admin.message.fetchError')); // Hiển thị thông báo lỗi khi không lấy được dữ liệu
            }
        };

        fetchMembershipPacket();
    }, [id, t]);

    const handleUpdateMembershipPacket = async (values: MembershipPackage) => {
        setLoading(true);
        try {
            const response = await updateMembershipPacketById(id as string, values);
            if (response.ok) {
                message.success(t('admin.message.updateSuccess')); // Thông báo thành công
            } else {
                const result = await response.json();
                message.error(result.message || t('admin.message.updateError')); // Thông báo lỗi
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
                { path: `${import.meta.env.VITE_PREFIX_URL_ADMIN}/membership-packets`, name: t('admin.membership-packet.title') },
                { path: ``, name: t('admin.membership-packet.create.title') },
            ]}
        >
            {!membershipPacket ?
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '75vh' }}>
                    <Spin indicator={<LoadingOutlined spin />} />
                </div> :
                <Form onFinish={handleUpdateMembershipPacket} layout="vertical" initialValues={membershipPacket}>
                    <Form.Item
                        label={t('admin.membership-packet.update.membership-packetName')}
                        name="name"
                        rules={[{ required: true, message: t('admin.message.requiredMessage') }]} // Thông báo yêu cầu nhập chung
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
                        label={t('admin.membership-packet.update.description')}
                        name="description"
                        rules={[{ required: true, message: t('admin.message.requiredMessage') }]} // Thông báo yêu cầu nhập chung
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            {t('admin.membership-packet.update.updateMembershipPacketButton')}
                        </Button>
                    </Form.Item>
                </Form>
            }
        </OutletTemplate>
    );
};

export default EditMembershipPacket;