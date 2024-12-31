import React, { useEffect, useState } from 'react';
import {Button, Form, Input, message, Spin} from 'antd';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {getCategoryById, updateCategoryById} from "../../../services/categoryService.tsx";
import OutletTemplate from '../../../templates/Outlet';
import {Category} from "../Create";
import {LoadingOutlined} from "@ant-design/icons";

const PREFIX_URL_ADMIN: string = import.meta.env.VITE_PREFIX_URL_ADMIN as string;

const UpdateCategory: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await getCategoryById(id as string);
                const result = await response.json();
                if (!response.ok || result.status !== 200) {
                    message.error(t('admin.message.fetchError'));
                    return;
                }
                setCategory(result.data);
            } catch (error) {
                message.error(t('admin.message.fetchError'));
            }
        };

        fetchCategory();
    }, [id, t]);

    const handleUpdateCategory = async (values: Category) => {
        setLoading(true);
        try {
            const response = await updateCategoryById(id as string, values);
            if (response.ok) {
                message.success(t('admin.message.updateSuccess'));
            } else {
                const result = await response.json();
                message.error(result.message || t('admin.message.updateError'));
            }
        } catch (error) {
            message.error(t('admin.message.updateError'));
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
                { path: `${PREFIX_URL_ADMIN}/categories`, name: t('admin.category.title') },
                { path: ``, name: t('admin.category.update.title') },
            ]}
        >
            {!category ?
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '75vh' }}>
                    <Spin indicator={<LoadingOutlined spin />} />
                </div> :
                <Form
                    form={form}
                    onFinish={handleUpdateCategory}
                    layout="vertical"
                    initialValues={category}
                >
                    <Form.Item
                        label={t('admin.category.name')}
                        name="name"
                        rules={[{
                            required: true,
                            message: t('admin.message.requiredMessage')
                        }]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label={t('admin.category.description')}
                        name="description"
                    >
                        <Input.TextArea/>
                    </Form.Item>
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
            }
        </OutletTemplate>
    );
};

export default UpdateCategory;