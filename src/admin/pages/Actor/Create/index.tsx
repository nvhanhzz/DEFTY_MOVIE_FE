import React, { useState } from 'react';
import { Button, Form, Input, message, DatePicker, Select, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import OutletTemplate from '../../../templates/Outlet';
import './CreateActor.scss';
import {postActor} from "../../../services/actorService.tsx";
import AvtEditor from "../../../components/AvtEditor";
import CountrySelect from "../../../components/CountrySelect";
import {standardization} from "../../../helpers/Date.tsx";

const PREFIX_URL_ADMIN: string = import.meta.env.VITE_PREFIX_URL_ADMIN as string;
const DEFAULT_AVATAR =  "https://res.cloudinary.com/drsmkfjfo/image/upload/v1743305606/21659bb0-0bde-4c32-ac2c-0ca8d26ec620_avatarDefault.jpg";

export interface ActorFromValues {
    fullName: string;
    gender: string;
    dateOfBirth: string;
    weight: number;
    height: number;
    nationality: string;
    description: string;
    avatar?: File;
}

const CreateActor: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleCreateAccount = async (values: ActorFromValues) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('fullName', values.fullName);
            formData.append('gender', values.gender);
            formData.append('dateOfBirth', values.dateOfBirth);
            formData.append('weight', String(values.weight));
            formData.append('height', String(values.height));
            formData.append('nationality', values.nationality);
            formData.append('description', values.description);
            if (file) {
                formData.append('avatar', file);
            }

            const response = await postActor(formData);
            const result = await response.json();
            console.log(result);
            if (!response.ok || result.status !== 201) {
                message.error(result.message || t('admin.message.createError'));
                return;
            }

            message.success(t('admin.message.createSuccess'));
            navigate(`${PREFIX_URL_ADMIN}/actors`);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            message.error(t('admin.message.fetchError'));
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarSave = (file: File | null) => {
        setFile(file);
    };

    const handleResetForm = () => {
        form.resetFields();
        setFile(null);
    };

    return (
        <OutletTemplate
            breadcrumbItems={[
                { path: `${PREFIX_URL_ADMIN}/dashboard`, name: t('admin.dashboard.title') },
                { path: `${PREFIX_URL_ADMIN}/actors`, name: t('admin.actor.title') },
                { path: ``, name: t('admin.actor.create.title') },
            ]}
        >
            <Form
                form={form}
                onFinish={handleCreateAccount}
                layout="vertical"
                className="create-account-form"
            >
                <Row gutter={10}>
                    <Col span={14}>
                        <Form.Item
                            label={t('admin.actor.fullName')}
                            name="fullName"
                            rules={[{ required: true, message: t('admin.actor.create.validation.fullName') }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label={t('admin.actor.dateOfBirth')}
                            name="datepicker"
                            rules={[{ required: true, message: t('admin.actor.create.validation.dateOfBirth') }]}
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
                            rules={[{ required: true, message: t('admin.actor.create.validation.gender') }]}
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
                            rules={[{ required: true, message: t('admin.actor.create.validation.weight') }]}
                        >
                            <Input type="number" min={0} />
                        </Form.Item>

                        <Form.Item
                            label={t('admin.actor.height')}
                            name="height"
                            rules={[{ required: true, message: t('admin.actor.create.validation.height') }]}
                        >
                            <Input type="number" min={0}/>
                        </Form.Item>

                        <Form.Item
                            label={t('admin.actor.nationality')}
                            name="nationality"
                            rules={[{ required: true, message: t('admin.actor.create.validation.nationality') }]}
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
                            rules={[{ required: true, message: t('admin.actor.create.validation.description') }]}
                        >
                            <Input.TextArea autoSize={{ minRows: 3, maxRows: 100 }} />
                        </Form.Item>
                    </Col>

                    <Col span={8} className="avatar-col">
                        <Form.Item label={t('admin.actor.avatar')} className="avatar-wrapper">
                            <AvtEditor
                                onSave={handleAvatarSave}
                                initialImage={file
                                    ? URL.createObjectURL(file)
                                    :  DEFAULT_AVATAR
                                }
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <div className="form-actions">
                    <Button
                        htmlType="button"
                        onClick={handleResetForm}  // Gọi hàm reset khi bấm nút Reset
                        className="reset-button"
                    >
                        {t('admin.form.reset')}
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        className="submit-button"
                    >
                        {t('admin.form.create')}
                    </Button>
                </div>
            </Form>
        </OutletTemplate>
    );
};

export default CreateActor;