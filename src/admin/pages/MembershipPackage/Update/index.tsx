import React, { useEffect, useState } from 'react';
import {Button, Form, Input, message, Spin, Col, Row, Select, InputNumber} from 'antd';
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
    basePrice: number;
}

const EditMembershipPacket: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [membershipPacket, setMembershipPacket] = useState<MembershipPacket | null>(null);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [selectedType, setSelectedType] = useState<string | undefined>(undefined);

    useEffect(() => {
        const fetchMembershipPacket = async () => {
            try {
                const response = await getMembershipPacketById(id as string);
                const result = await response.json();
                if (!response.ok || result.status !== 200) {
                    message.error(t('admin.message.fetchError')); // Sử dụng thông báo lỗi chung khi lấy dữ liệu
                    return;
                }
                console.log(result.data)
                setMembershipPacket(result.data);
                form.setFieldsValue(result.data);
                setSelectedType(result.data.name);
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
                console.log(result);
                message.error(result.message || t('admin.message.updateError')); // Thông báo lỗi
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            message.error(t('admin.message.updateError')); // Hiển thị lỗi khi có lỗi xảy ra trong quá trình cập nhật
        } finally {
            setLoading(false);
        }
    };

    const calculateFinalPrice = () => {
        const duration = form.getFieldValue("duration") || 1;
        const discount = form.getFieldValue("discount") || 0;
        const basePrice = form.getFieldValue("basePrice") || 0;

        if (selectedType === "Free Trial") return 0;

        const originalPrice = duration * basePrice;
        const finalPrice = originalPrice * (1 - discount / 100);
        return Math.round(finalPrice);
    };

    const handleResetForm = () => {
        form.resetFields();
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
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleUpdateMembershipPacket}
                    initialValues={{ duration: 1, price: 0, discount: 0, basePrice: 99000 }}
                >
                    {/* Hàng 1: Name & Base Price */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label={t('admin.membership-packet.create.membership-packetName')}
                                name="name"

                                rules={[{ required: true, message: t('admin.message.requiredMessage') }]}
                            >
                                <Select
                                    placeholder={t('admin.membership-packet.select.title')}
                                    onChange={(value) => {
                                        setSelectedType(value);
                                        form.setFieldsValue({
                                            duration: value === "Free Trial" ? 1 : value === "Normal" ? 0 : undefined,
                                            basePrice: value === "Normal" ? 0 : form.getFieldValue("basePrice"),
                                            price: value === "Free Trial" || value === "Normal" ? 0 : calculateFinalPrice(),
                                        });
                                    }}
                                >
                                    <Select.Option disabled={true}>{t('admin.membership-packet.chooseMembershipPacket')}</Select.Option>
                                    <Select.Option value="Normal">Normal</Select.Option>
                                    <Select.Option value="Premium">Premium</Select.Option>
                                    <Select.Option value="Free Trial">Free Trial</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label={t('admin.membership-packet.create.basePrice')}
                                name="basePrice"
                                rules={[{ required: true, message: t('admin.message.requiredMessage') }]}
                            >
                                <InputNumber
                                    disabled={selectedType === "Normal"}
                                    min={0}
                                    style={{ width: '100%' }}
                                    formatter={(value) => `${value} VNĐ`}
                                    parser={(value) => value?.replace(' VNĐ', '')}
                                    onChange={() => form.setFieldsValue({ price: calculateFinalPrice() })}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Hàng 2: Discount & Duration */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label={t('admin.membership-packet.create.discount')}
                                name="discount"
                                rules={[{ required: true, message: t('admin.message.requiredMessage') }]}
                            >
                                <InputNumber
                                    disabled={selectedType === "Normal"}
                                    min={0}
                                    max={100}
                                    formatter={(value) => `${value}%`}
                                    parser={(value) => value?.replace('%', '')}
                                    style={{ width: '100%' }}
                                    onChange={() => form.setFieldsValue({ price: calculateFinalPrice() })}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={t('admin.membership-packet.create.duration')}
                                name="duration"
                                rules={[{ required: true, message: t('admin.message.requiredMessage') }]}
                            >
                                <Select
                                    disabled={selectedType === "Free Trial" || selectedType === "Normal"}
                                    placeholder={t('admin.membership-packet.create.selectDuration')}
                                    onChange={() => form.setFieldsValue({ price: calculateFinalPrice() })}
                                >
                                    <Select.Option disabled={true}>{t('admin.membership-packet.chooseDuration')}</Select.Option>
                                    <Select.Option value={1}>1 {t('admin.membership-packet.month')}</Select.Option>
                                    <Select.Option value={3}>3 {t('admin.membership-packet.month')}</Select.Option>
                                    <Select.Option value={6}>6 {t('admin.membership-packet.month')}</Select.Option>
                                    <Select.Option value={9}>9 {t('admin.membership-packet.month')}</Select.Option>
                                    <Select.Option value={12}>12 {t('admin.membership-packet.month')}</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label={t('admin.membership-packet.create.description')}
                                name="description"
                                rules={[{ required: true, message: t('admin.message.requiredMessage') }]}
                            >
                                <Input.TextArea autoSize={{ minRows: 3, maxRows: 100 }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={t('admin.membership-packet.create.price')}
                                name="price"
                            >
                                <InputNumber
                                    disabled
                                    style={{ width: '100%' }}
                                    formatter={(value) => `${value} VNĐ`}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Nút Submit */}
                    <div className="form-actions">
                        <Button htmlType="button" onClick={handleResetForm} className="reset-button">
                            {t('admin.form.reset')}
                        </Button>
                        <Button type="primary" htmlType="submit" loading={loading} className="submit-button">
                            {t('admin.form.update')}
                        </Button>
                    </div>
                </Form>
            }
        </OutletTemplate>
    );
};

export default EditMembershipPacket;