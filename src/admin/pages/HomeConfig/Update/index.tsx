import React, {useEffect, useState} from 'react';
import {Button, Col, Form, Input, message, Row, Select} from 'antd';
import {useParams} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import OutletTemplate from '../../../templates/Outlet';
import {getShowOnById, updateShowOnById} from "../../../services/homeConfigService.tsx";
import {getCategories} from "../../../services/categoryService.tsx";
import {Category} from "../../Category";
import {ShowOnFromValue} from "../Create";
const PREFIX_URL_ADMIN: string = import.meta.env.VITE_PREFIX_URL_ADMIN as string;

const UpdateShowOn: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [contentType, setContentType] = useState<string>('');
    const [contents, setContents] = useState<Category[] | any>([]);
    const [initData, setInitData] = useState<ShowOnFromValue | null>(null);

    useEffect(() => {
        const fetchShowOn = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const response = await getShowOnById(id);
                const result = await response.json();
                if (response.ok && result.status === 200) {
                    const data = result.data;
                    form.setFieldsValue({
                        contentId: data.contentId,
                        contentType: data.contentType,
                        note: data.note,
                        position: data.position
                    });
                    setInitData(data);
                    setContentType(data.contentType);
                } else {
                    message.error(t('admin.message.fetchError'));
                }
            } catch (e) {
                message.error(t('admin.message.fetchError'));
            } finally {
                setLoading(false);
            }
        };

        fetchShowOn();
    }, [id, form, t]);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await getCategories(0, 99999999999);
            const result = await response.json();

            if (!response.ok || result.status === 404) {
                setContents([]);
                return;
            }
            const content: Category[] = result.data.content;
            setContents(content);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        switch (contentType) {
            case 'category':
                fetchCategories();
                break;
            default:
                break;
        }
    }, [contentType]);

    const handleUpdateShowOn = async (values: ShowOnFromValue) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('contentId', String(values.contentId));
            formData.append('contentType', values.contentType.toLowerCase());
            formData.append('position', String(values.contentId));
            formData.append('note', values.note);
            const response = await updateShowOnById(id as string, formData);
            const result = await response.json();
            if (!response.ok || result.status !== 201) {
                message.error(result.message || t('admin.message.createError'));
                return;
            }
            message.success(t('admin.message.updateSuccess'));
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            message.error(t('admin.message.fetchError'));
        } finally {
            setLoading(false);
        }
    };
    const handleResetForm = () => {
        // form.resetFields();
        form.setFieldsValue(initData);
    };
    return (
        <OutletTemplate
            breadcrumbItems={[
                { path: `${PREFIX_URL_ADMIN}/dashboard`, name: t('admin.dashboard.title') },
                { path: `${PREFIX_URL_ADMIN}/home-config`, name: t('admin.homeConfig.title') },
                { path: ``, name: t('admin.homeConfig.update.title') },
            ]}
        >
            <Form
                form={form}
                onFinish={handleUpdateShowOn}
                layout="vertical"
            >
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Form.Item
                            label={t('admin.homeConfig.contentType')}
                            name="contentType"
                            rules={[{
                                required: true,
                                message: t('admin.message.requiredMessage')
                            }]}
                        >
                            <Select
                                placeholder={t('admin.homeConfig.contentType')}
                                allowClear
                                onChange={(value) => {
                                    setContentType(value as string)
                                    form.setFieldsValue({ contentId: undefined })
                                }}
                            >
                                <Select.Option value="category">{t('admin.category.title')}</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={t('admin.homeConfig.position')}
                            name="position"
                            rules={[{
                                required: true,
                                message: t('admin.message.requiredMessage')
                            }]}
                        >
                            <Input type="number"/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={t('admin.homeConfig.contentName')}
                            name="contentId"
                            rules={contentType === 'category' ? [{
                                required: true,
                                message: t('admin.message.requiredMessage')
                            }] : []}
                        >
                            <Select
                                placeholder={t('admin.homeConfig.contentName')}
                                allowClear
                            >
                                {(() => {
                                    switch (contentType) {
                                        case 'category':
                                            return contents.map((item: Category) => (
                                                <Select.Option key={item.id} value={item.id}>
                                                    {item.name}
                                                </Select.Option>
                                            ));
                                        default:
                                            return;
                                    }
                                })()}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={t('admin.homeConfig.note')}
                            name="note"
                        >
                            <Input.TextArea/>
                        </Form.Item>
                    </Col>
                </Row>
                <div className="form-actions">
                    <Button
                        htmlType="button"
                        onClick={handleResetForm}
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
                        {t('admin.form.update')}
                    </Button>
                </div>
            </Form>
        </OutletTemplate>
    );
};
export default UpdateShowOn;