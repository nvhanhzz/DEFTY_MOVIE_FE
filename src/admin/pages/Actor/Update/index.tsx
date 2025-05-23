import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message, DatePicker, Select, Row, Col } from 'antd';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import OutletTemplate from '../../../templates/Outlet';
import { getActorById, updateActorById } from "../../../services/actorService.tsx";
import dayjs from 'dayjs';
import { ActorFromValues } from "../Create";
import CountrySelect from "../../../components/CountrySelect";
import AvtEditor from "../../../components/AvtEditor";
import {standardization} from "../../../helpers/Date.tsx";

const PREFIX_URL_ADMIN: string = import.meta.env.VITE_PREFIX_URL_ADMIN as string;
const DEFAULT_AVATAR =  "https://res.cloudinary.com/drsmkfjfo/image/upload/v1743305606/21659bb0-0bde-4c32-ac2c-0ca8d26ec620_avatarDefault.jpg";

const UpdateActor: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const [initData, setInitData] = useState<ActorFromValues | null>(null);

    useEffect(() => {
        const fetchActor = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const response = await getActorById(id);
                const result = await response.json();
                if (response.ok && result.status === 200) {
                    const data = result.data;
                    form.setFieldsValue({
                        fullName: data.fullName,
                        gender: data.gender,
                        datePicker: data.dateOfBirth ? dayjs(data.dateOfBirth) : null, // Sử dụng dayjs để xử lý ngày
                        weight: data.weight,
                        height: data.height,
                        nationality: data.nationality,
                        description: data.description,
                    });
                    if (data.avatar) {
                        setAvatarUrl(data.avatar);
                    }
                    setInitData(data);

                } else {
                    message.error(t('admin.message.fetchError'));
                }
            } catch (e) {
                message.error(t('admin.message.fetchError'));
            } finally {
                setLoading(false);
            }
        };

        fetchActor();
    }, [id, form, t]);

    // Handle form submission
    const handleUpdateActor = async (values: ActorFromValues) => {
        setLoading(true);
        try {
            if (!id) return;

            const formData = new FormData();
            formData.append('fullName', values.fullName);
            formData.append('gender', values.gender);
            formData.append('dateOfBirth', values.dateOfBirth);
            formData.append('weight', String(values.weight));
            formData.append('height', String(values.height));
            formData.append('nationality', values.nationality);
            formData.append('description', values.description);
            console.log(formData);

            if (file) {
                formData.append('avatar', file);
            }

            const response = await updateActorById(id, formData);
            const result = await response.json();
            if (!response.ok || result.status !== 200) {
                message.error(result.message || t('admin.message.updateError'));
                return;
            }

            message.success(t('admin.message.updateSuccess'));
        } catch (error) {
            message.error(t('admin.message.fetchError'));
        } finally {
            setLoading(false);
        }
    };

    // Handle avatar change
    const handleAvatarSave = (file: File | null) => {
        setFile(file);
    };

    const handleResetForm = () => {
        form.setFieldsValue(initData);
        if (initData?.avatar === null) {
            setFile(null);
            setAvatarUrl('null' + avatarUrl);
        } else {
            setFile(null);
            setAvatarUrl(avatarUrl + " " as string);
        }
    };

    return (
        <OutletTemplate
            breadcrumbItems={[
                { path: `${PREFIX_URL_ADMIN}/dashboard`, name: t('admin.dashboard.title') },
                { path: `${PREFIX_URL_ADMIN}/actors`, name: t('admin.actor.title') },
                { path: '', name: t('admin.actor.update.title') },
            ]}
        >
            <Form
                form={form}
                onFinish={handleUpdateActor}
                layout="vertical"
                className="update-actor-form"
            >
                <Row gutter={16}>
                    <Col span={14}>
                        <Form.Item
                            label={t('admin.actor.fullName')}
                            name="fullName"
                            rules={[{ required: true, message: t('admin.actor.validation.fullName') }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label={t('admin.actor.dateOfBirth')}
                            name="datePicker"
                            rules={[{ required: true, message: t('admin.actor.validation.dateOfBirth') }]}
                        >
                            <DatePicker
                                format="YYYY-MM-DD"
                                onChange={(_date, dateString) => { form.setFieldsValue({ dateOfBirth: standardization(dateString as string) }) }}
                            />
                        </Form.Item>
                        <Form.Item
                            name="dateOfBirth"
                            hidden
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label={t('admin.actor.gender.title')}
                            name="gender"
                            rules={[{ required: true, message: t('admin.actor.validation.gender') }]}
                        >
                            <Select placeholder={t('admin.actor.gender.placeholder')}>
                                <Select.Option value="Male">{t('admin.actor.gender.male')}</Select.Option>
                                <Select.Option value="Female">{t('admin.actor.gender.female')}</Select.Option>
                                <Select.Option value="Other">{t('admin.actor.gender.other')}</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label={t('admin.actor.weight')}
                            name="weight"
                            rules={[{ required: true, message: t('admin.actor.validation.weight') }]}
                        >
                            <Input type="number" min={0} />
                        </Form.Item>

                        <Form.Item
                            label={t('admin.actor.height')}
                            name="height"
                            rules={[{ required: true, message: t('admin.actor.validation.height') }]}
                        >
                            <Input type="number" min={0} />
                        </Form.Item>

                        <Form.Item
                            label={t('admin.actor.nationality')}
                            name="nationality"
                            rules={[{ required: true, message: t('admin.actor.validation.nationality') }]}
                        >
                            <CountrySelect
                                placeholder={t('admin.form.selectNationality')}
                                onChange={(value) => form.setFieldsValue({ nationality: value })}
                                type='nationality'
                            />
                        </Form.Item>

                        <Form.Item
                            label={t('admin.actor.description')}
                            name="description"
                            rules={[{ required: true, message: t('admin.actor.validation.description') }]}
                        >
                            <Input.TextArea autoSize={{ minRows: 3, maxRows: 100 }} />
                        </Form.Item>
                    </Col>

                    <Col span={8} style={{ display: 'flex', justifyContent: 'center' }}>
                        <Form.Item label={t('admin.actor.avatar')} className="avatar-wrapper">
                            <AvtEditor
                                onSave={handleAvatarSave}
                                initialImage={avatarUrl || DEFAULT_AVATAR} // Ảnh mặc định
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <div className="form-actions">
                    <Button onClick={handleResetForm} className="reset-button">
                        {t('admin.form.reset')}
                    </Button>
                    <Button type="primary" htmlType="submit" loading={loading} className="submit-button">
                        {t('admin.form.update')}
                    </Button>
                </div>
            </Form>
        </OutletTemplate>
    );
};

export default UpdateActor;