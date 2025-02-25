import React, { useState } from 'react';
import {Button, Col, Form, Input, message, Row, Select} from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import OutletTemplate from '../../../templates/Outlet';
import './CreateBanner.scss';
import { postBanner } from '../../../services/bannerService.tsx';
import AvtEditor from '../../../components/AvtEditor';

const PREFIX_URL_ADMIN: string = import.meta.env.VITE_PREFIX_URL_ADMIN as string;

export interface BannerFormValues {
    title: string;
    link: string;
    key: string;
    position: number;
    thumbnail?: File;
    contentType: string;
    contentId: number;
}

const CreateBanner: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleCreateBanner = async (values: BannerFormValues) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('contentId', String(values.contentId));
            formData.append('link', values.link);
            formData.append('key', values.key);
            formData.append('position', String(values.position));
            formData.append('contentType', values.contentType);
            if (file) {
                formData.append('thumbnail', file);
            }

            const response = await postBanner(formData);
            const result = await response.json();
            if (!response.ok || result.status !== 201) {
                message.error(result.message || t('admin.message.createError'));
                return;
            }

            message.success(t('admin.message.createSuccess'));
            navigate(`${PREFIX_URL_ADMIN}/banners`);
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
                { path: `${PREFIX_URL_ADMIN}/banners`, name: t('admin.banner.title') },
                { path: ``, name: t('admin.banner.create.title') },
            ]}
        >
            <Form
                form={form}
                onFinish={handleCreateBanner}
                layout="vertical"
                className="create-banner-form"
                style={{margin: "10px 20px"}}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label={t('admin.banner.title')}
                            name="title"
                            rules={[{ required: true, message: t('admin.banner.create.validation.title') }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={t('admin.banner.link')}
                            name="link"
                            rules={[{ required: true, message: t('admin.banner.create.validation.link') }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label={t('admin.banner.position')}
                            name="position"
                            rules={[{ required: true, message: t('admin.banner.create.validation.position') }]}
                        >
                            <Input type="number" min={0} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={t('admin.banner.key')}
                            name="key"
                            rules={[{ required: true, message: t('admin.banner.create.validation.key') }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label={t("admin.banner.contentType")}
                            name="contentType"
                            rules={[{ required: true, message: t("admin.banner.validation.contentType") }]}
                        >
                            <Select placeholder={t("admin.banner.placeholder.contentType")}>
                                <Select.Option disabled>--- Choose content Type ---</Select.Option>
                                <Select.Option value="1">Movie</Select.Option>
                                <Select.Option value="2">Category</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label={t('admin.banner.thumbnail')}
                                   className="thumbnail-wrapper"
                                   rules={[{ required: true }]}
                        >
                            <AvtEditor
                                onSave={handleAvatarSave}
                                initialImage={
                                file
                                    ? URL.createObjectURL(file)
                                    : '/assets/images/background-default.jpg'
                            }
                                shape="rectangle"
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <div className="form-actions">
                    <Button htmlType="button" onClick={handleResetForm} className="reset-button">
                        {t('admin.form.reset')}
                    </Button>
                    <Button type="primary" htmlType="submit" loading={loading} className="submit-button">
                        {t('admin.form.create')}
                    </Button>
                </div>
            </Form>
        </OutletTemplate>
    );
};

export default CreateBanner;