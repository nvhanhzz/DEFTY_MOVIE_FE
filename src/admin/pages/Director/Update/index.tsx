import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message, DatePicker, Select, Row, Col } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import OutletTemplate from '../../../templates/Outlet';
import { getDirectorById, updateDirectorById } from "../../../services/directorService.tsx";
import dayjs from 'dayjs';
import { DirectorFromValues } from "../Create";
import CountrySelect from "../../../components/CountrySelect";
import AvtEditor from "../../../components/AvtEditor";
import {standardization} from "../../../helpers/Date.tsx";
import {Director} from "../index.tsx";

const PREFIX_URL_ADMIN: string = import.meta.env.VITE_PREFIX_URL_ADMIN as string;

const UpdateDirector: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [initData, setInitData] = useState<Director | null>(null);

    // Fetch director data when the component mounts
    useEffect(() => {
        const fetchDirector = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const response = await getDirectorById(id);
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

        fetchDirector();
    }, [id, form, t]);

    // Handle form submission
    const handleUpdateDirector = async (values: DirectorFromValues) => {
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

            if (file) {
                formData.append('avatar', file);
            }

            const response = await updateDirectorById(id, formData);
            const result = await response.json();
            if (!response.ok) {
                message.error(result.message || t('admin.message.updateError'));
                return;
            }
            if (result.status !== 200) {
                message.error(result.message || t('admin.message.updateError'));
                return;
            }

            message.success(t('admin.message.updateSuccess'));
            navigate(`${PREFIX_URL_ADMIN}/directors`);
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

    // Reset form
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
                { path: `${PREFIX_URL_ADMIN}/directors`, name: t('admin.director.title') },
                { path: '', name: t('admin.director.update.title') },
            ]}
        >
            <Form
                form={form}
                onFinish={handleUpdateDirector}
                layout="vertical"
                className="update-director-form"
            >
                <Row gutter={16}>
                    <Col span={16}>
                        <Form.Item
                            label={t('admin.director.fullName')}
                            name="fullName"
                            rules={[{ required: true, message: t('admin.director.validation.fullName') }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label={t('admin.director.dateOfBirth')}
                            name="datePicker"
                            rules={[{ required: true, message: t('admin.director.validation.dateOfBirth') }]}
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
                            label={t('admin.director.gender.title')}
                            name="gender"
                            rules={[{ required: true, message: t('admin.director.validation.gender') }]}
                        >
                            <Select placeholder={t('admin.director.gender.placeholder')}>
                                <Select.Option value="male">{t('admin.director.gender.male')}</Select.Option>
                                <Select.Option value="female">{t('admin.director.gender.female')}</Select.Option>
                                <Select.Option value="other">{t('admin.director.gender.other')}</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label={t('admin.director.weight')}
                            name="weight"
                            rules={[{ required: true, message: t('admin.director.validation.weight') }]}
                        >
                            <Input type="number" />
                        </Form.Item>

                        <Form.Item
                            label={t('admin.director.height')}
                            name="height"
                            rules={[{ required: true, message: t('admin.director.validation.height') }]}
                        >
                            <Input type="number" />
                        </Form.Item>

                        <Form.Item
                            label={t('admin.director.nationality')}
                            name="nationality"
                            rules={[{ required: true, message: t('admin.director.validation.nationality') }]}
                        >
                            <CountrySelect
                                placeholder={t('admin.form.selectNationality')}
                                onChange={(value) => form.setFieldsValue({ nationality: value })}
                                type='nationality'
                            />
                        </Form.Item>

                        <Form.Item
                            label={t('admin.director.description')}
                            name="description"
                            rules={[{ required: true, message: t('admin.director.validation.description') }]}
                        >
                            <Input.TextArea />
                        </Form.Item>
                    </Col>

                    <Col span={8} style={{display: 'flex', justifyContent: 'center'}}>
                        <Form.Item label={t('admin.director.avatar')} className="avatar-wrapper">
                            <AvtEditor
                                onSave={handleAvatarSave}
                                initialImage={avatarUrl as string}
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

export default UpdateDirector;
