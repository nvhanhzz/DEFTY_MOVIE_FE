import React from 'react';
import { Form, DatePicker, Select, Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import "./Search.scss";

// Extend dayjs with customParseFormat for strict parsing
dayjs.extend(customParseFormat);

export interface SearchFormField {
    type: 'date' | 'select' | 'input' | string;
    label: string;
    name: string;
    options?: { label: string; value: any }[];
    placeholder?: string;
    style?: React.CSSProperties;
    rules?: Array<Record<string, any>>;
}

export interface SearchFormConfig {
    onSearch: (filters: Record<string, any>) => void;
    fields: SearchFormField[];
    initialValues?: Record<string, any>; // Optional initial values
}

const SearchFormTemplate: React.FC<SearchFormConfig> = ({ onSearch, fields, initialValues = {} }) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();

    const handleSearch = () => {
        const values = form.getFieldsValue();
        const formattedValues = Object.keys(values).reduce((acc, key) => {
            const field = fields.find((f) => f.name === key);
            if (field?.type === 'date' && values[key]) {
                const date = dayjs(values[key], 'YYYY-MM-DD', true);
                acc[key] = date.isValid() ? date.format('YYYY-MM-DD') : undefined;
            } else {
                acc[key] = values[key];
            }
            return acc;
        }, {} as Record<string, any>);
        onSearch(formattedValues);
    };

    // Ensure initial values are correctly formatted for date fields
    const formattedInitialValues = Object.keys(initialValues).reduce((acc, key) => {
        const field = fields.find((f) => f.name === key);
        if (field?.type === 'date' && initialValues[key]) {
            const date = dayjs(initialValues[key], 'YYYY-MM-DD', true);
            acc[key] = date.isValid() ? date : undefined;
        } else {
            acc[key] = initialValues[key];
        }
        return acc;
    }, {} as Record<string, any>);

    return (
        <Form
            form={form}
            layout="inline"
            initialValues={formattedInitialValues}
            style={{ marginBottom: 20 }}
            className="search-form-container"
        >
            {fields.map((field) => (
                <Form.Item
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    rules={field.rules || []}
                    className="search-form-item"
                >
                    {field.type === 'date' && (
                        <DatePicker
                            format="YYYY-MM-DD"
                            placeholder={field.placeholder || t('admin.form.selectDate')}
                            style={field.style || { width: '150px' }}
                            onChange={(date) =>
                                form.setFieldValue(
                                    field.name,
                                    date ? dayjs(date).format('YYYY-MM-DD') : undefined
                                )
                            }
                        />
                    )}
                    {field.type === 'select' && (
                        <Select
                            placeholder={field.placeholder || t('admin.form.selectOption')}
                            options={field.options}
                            style={field.style || { width: '150px' }}
                        />
                    )}
                    {field.type === 'input' && (
                        <Input
                            placeholder={field.placeholder || t('admin.form.enterValue')}
                            style={field.style || { width: '150px' }}
                        />
                    )}
                </Form.Item>
            ))}
            <Form.Item>
                <Button
                    type="primary"
                    icon={<SearchOutlined />}
                    onClick={handleSearch}
                >
                    {t('admin.form.search')}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default SearchFormTemplate;