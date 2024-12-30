import React from 'react';
import { Form, DatePicker, Select, Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import "./Search.scss";

export interface SearchFormConfig {
    onSearch: (filters: Record<string, string>) => void; // Nhận filters làm tham số
    fields: Array<{
        type: 'date' | 'select' | 'input' | string;
        label: string;
        name: string;
        options?: { label: string; value: any }[];
        placeholder?: string;
        style?: React.CSSProperties;
    }>;
}

const SearchFormTemplate: React.FC<SearchFormConfig> = ({ onSearch, fields }) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();

    const handleSearch = () => {
        const values = form.getFieldsValue(); // Lấy tất cả giá trị từ form
        onSearch(values); // Gọi hàm onSearch với giá trị form
    };

    return (
        <Form
            form={form}
            layout="inline"
            style={{ marginBottom: 20 }}
            className={'search-form-container'}
        >
            {fields.map((field) => (
                <Form.Item key={field.name} label={field.label} name={field.name} className={'search-form-item'}>
                    {field.type === 'date' && (
                        <DatePicker
                            format="YYYY-MM-DD"
                            placeholder={field.placeholder || t('admin.form.selectDate')}
                            style={field.style || { width: '150px' }}
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
