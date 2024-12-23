import React from 'react';
import { Form, DatePicker, Select, Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

export interface SearchFormConfig {
    filters: Record<string, any>;
    onFilterChange: (changedValues: Record<string, any>) => void;
    onSearch: () => void;
    fields: Array<{
        type: 'date' | 'select' | 'input';
        label: string;
        name: string;
        options?: { label: string; value: any }[]; // For Select fields
        placeholder?: string;
        style?: React.CSSProperties;
    }>;
}

const SearchFormTemplate: React.FC<SearchFormConfig> = ({
                                                            filters,
                                                            onFilterChange,
                                                            onSearch,
                                                            fields,
                                                        }) => {
    const { t } = useTranslation();

    return (
        <Form
            layout="inline"
            style={{ marginBottom: 20 }}
            initialValues={filters}
            onValuesChange={(changedValues) => onFilterChange(changedValues)}
        >
            {fields.map((field) => (
                <Form.Item key={field.name} label={field.label} name={field.name}>
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
                    onClick={onSearch}
                >
                    {t('admin.form.filter')}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default SearchFormTemplate;