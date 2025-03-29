import React, {useEffect, useState} from 'react';
import {Button, Col, Form, Input, message, Row, Select} from 'antd';
import {useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import OutletTemplate from '../../../templates/Outlet';
import {getContentByContentType, postShowOn} from "../../../services/homeConfigService.tsx";
import {Category} from "../../Category";
const PREFIX_URL_ADMIN: string = import.meta.env.VITE_PREFIX_URL_ADMIN as string;

export interface ShowOnFromValue {
    id: string;
    position: number;
    contentId: number;
    contentType: string;
    note: string
    contentName: string;
}

const CreateShowOn: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [contentType, setContentType] = useState<string>('');
    const [contents, setContents] = useState<Category[] | any>([]);

    const fetchContentByContentType = async (contentType: string) => {
        setLoading(true);
        try {
            const response = await getContentByContentType(contentType);
            if (!response.ok || response.status === 404) {
                setContents([]);
                return;
            }

            const result = await response.json();
            const content: Category[] = result.data;
            setContents(content);
        } catch (error) {
            console.error("Error fetching content:", error);
            setContents([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        switch (contentType) {
            case 'category':
                fetchContentByContentType(contentType);
                break;
            default:
                break;
        }
    }, [contentType]);

    const handleCreateShowOn = async (values: ShowOnFromValue) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('contentId', String(values.contentId));
            formData.append('contentType', values.contentType.toLowerCase());
            formData.append('position', String(values.position));
            formData.append('note', values.note);
            const response = await postShowOn(formData);
            const result = await response.json();
            if (!response.ok || result.status !== 201) {
                message.error(result.message || t('admin.message.createError'));
                return;
            }
            message.success(t('admin.message.createSuccess'));
            navigate(`${PREFIX_URL_ADMIN}/home-config`);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            message.error(t('admin.message.fetchError'));
        } finally {
            setLoading(false);
        }
    };
    const handleResetForm = () => {
        form.resetFields();
    };
    return (
        <OutletTemplate
            breadcrumbItems={[
                { path: `${PREFIX_URL_ADMIN}/dashboard`, name: t('admin.dashboard.title') },
                { path: `${PREFIX_URL_ADMIN}/home-config`, name: t('admin.homeConfig.title') },
                { path: ``, name: t('admin.homeConfig.create.title') },
            ]}
        >
            <Form
                form={form}
                onFinish={handleCreateShowOn}
                layout="vertical"
            >
                <Row gutter={16}>
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
                                <Select.Option value="movie">{t('admin.movie.title')}</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>

                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label={t('admin.homeConfig.note')}
                            name="note"
                        >
                            <Input.TextArea autoSize={{ minRows: 3, maxRows: 100 }} />
                        </Form.Item>
                    </Col>
                    {contentType && (
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
                    )}


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
                        {t('admin.form.create')}
                    </Button>
                </div>
            </Form>
        </OutletTemplate>
    );
};
export default CreateShowOn;