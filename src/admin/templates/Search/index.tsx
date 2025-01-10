import React, {useEffect} from 'react';
import { Form, DatePicker, Select, Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import "./Search.scss";
import dayjs from "dayjs";
import CountrySelect from "../../components/CountrySelect";

export interface SearchFormField {
    type: 'dateRange' | 'select' | 'input' | 'nationality' | 'country' | string;
    label: string;
    name: string;
    options?: { label: string; value: any }[];
    placeholder?: string | [string, string];
    style?: React.CSSProperties;
    rules?: Array<Record<string, any>>;
}

export interface SearchFormConfig {
    onSearch: (filters: Record<string, any>) => void;
    fields: SearchFormField[];
    initialValues?: Record<string, any>;
}

const SearchFormTemplate: React.FC<SearchFormConfig> = ({ onSearch, fields, initialValues = {} }) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue(initialValues);
    }, [initialValues]);

    return (
        <Form
            form={form}
            layout="inline"
            initialValues={initialValues} // Sử dụng trực tiếp initialValues
            style={{ marginBottom: 20 }}
            className="search-form-container"
            onFinish={onSearch} // Gọi trực tiếp onSearch khi form được submit
        >
            {fields.map((field) => (
                <Form.Item
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    rules={field.rules || []}
                    className="search-form-item"
                >
                    {field.type === 'dateRange' && (
                        <div>
                            <DatePicker.RangePicker
                                format="DD/MM/YYYY"
                                placeholder={
                                    Array.isArray(field.placeholder)
                                        ? field.placeholder
                                        : [
                                            t('admin.form.startDate'),
                                            t('admin.form.endDate'),
                                        ]
                                }
                                value={
                                    initialValues[field.name]
                                        ? initialValues[field.name]
                                            .split(' - ')
                                            .map((date: string) => (date ? dayjs(date, 'DD/MM/YYYY') : null))
                                        : undefined
                                }
                                allowEmpty={[true, true]}
                                onChange={(_dates, dateStrings) => {
                                    const [start, end] = dateStrings;

                                    const formattedStart = start ? dayjs(start, 'DD/MM/YYYY', true).isValid() ? dayjs(start, 'DD/MM/YYYY').format('DD/MM/YYYY') : '' : '';
                                    const formattedEnd = end ? dayjs(end, 'DD/MM/YYYY', true).isValid() ? dayjs(end, 'DD/MM/YYYY').format('DD/MM/YYYY') : '' : '';

                                    const result = formattedStart || formattedEnd ? `${formattedStart} - ${formattedEnd}` : '';;

                                    form.setFieldsValue({
                                        [field.name]: result,
                                    });
                                }}
                            />
                            <Form.Item name={field.name} style={{ display: 'none' }}>
                                <Input type="hidden" />
                            </Form.Item>
                        </div>
                    )}
                    {field.type === 'select' && (
                        <Select
                            placeholder={field.placeholder || t('admin.form.selectOption')}
                            options={field.options}
                            style={field.style || { width: '150px' }}
                            value={initialValues[field.name]}
                            allowClear
                        />
                    )}
                    {field.type === 'input' && (
                        <Input
                            placeholder={field.placeholder as string || t('admin.form.enterValue')}
                            style={field.style || { width: '150px' }}
                            value={initialValues[field.name]}
                        />
                    )}
                    {(field.type === 'nationality' || field.type === 'country') && (
                        <CountrySelect
                            type={field.type}
                            placeholder={
                                field.placeholder as string ||
                                (field.type === 'nationality'
                                    ? t('admin.form.selectNationality')
                                    : t('admin.form.selectCountry'))
                            }
                            style={field.style}
                            value={initialValues[field.name]}
                            onChange={(value) => form.setFieldsValue({ [field.name]: value })}
                        />
                    )}
                </Form.Item>
            ))}
            <Form.Item>
                <Button
                    type="default"
                    style={{ marginRight: '8px' }}
                    onClick={() => form.resetFields()} // Reset toàn bộ form
                >
                    {t('admin.form.reset')}
                </Button>
                <Button
                    type="primary"
                    icon={<SearchOutlined />}
                    htmlType="submit" // Trực tiếp submit form
                >
                    {t('admin.form.search')}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default SearchFormTemplate;