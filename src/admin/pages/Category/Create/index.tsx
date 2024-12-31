import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import OutletTemplate from '../../../templates/Outlet';
import {postCategory} from "../../../services/categoryService.tsx";

const PREFIX_URL_ADMIN: string = import.meta.env.VITE_PREFIX_URL_ADMIN as string;

export interface Category {
    name: string;
    description: string;
}

const CreateCategory: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [form] = Form.useForm();

    const handleCreateCategory = async (values: Category) => {
        setLoading(true);
        try {
            const response = await postCategory(values);
            const result = await response.json();
            if (!response.ok || result.status !== 201) {
                message.error(result.message || t('admin.message.createError'));
                return;
            }

            message.success(t('admin.message.createSuccess'));
            navigate(`${PREFIX_URL_ADMIN}/categories`);
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
                { path: `${PREFIX_URL_ADMIN}/categories`, name: t('admin.category.title') },
                { path: ``, name: t('admin.category.create.title') },
            ]}
        >
            <Form
                form={form}
                onFinish={handleCreateCategory}
                layout="vertical"
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
                    rules={[{
                        required: true,
                        message: t('admin.message.requiredMessage')
                    }]}
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
                        {t('admin.form.create')}
                    </Button>
                </div>
            </Form>
        </OutletTemplate>
    );
};

export default CreateCategory;