import React from 'react';
import { Select } from 'antd';
import countries from '../../../config/countries.json';

interface CountrySelectProps {
    placeholder?: string;
    style?: React.CSSProperties;
    allowClear?: boolean;
    value?: string;
    onChange?: (value: string) => void;
    type: 'nationality' | 'country';
}

const CountrySelect: React.FC<CountrySelectProps> = ({
                                                         placeholder,
                                                         style = { width: '250px' },
                                                         allowClear = true,
                                                         value,
                                                         onChange,
                                                         type,
                                                     }) => {
    return (
        <Select
            showSearch
            placeholder={placeholder}
            style={style}
            allowClear={allowClear}
            value={value}
            onChange={onChange}
            filterOption={(input, option) => {
                if (!option?.value) return false; // Xử lý trường hợp `value` không tồn tại
                return option.value.toLowerCase().includes(input.toLowerCase());
            }}
            options={countries.map((country, index) => ({
                key: index,
                label: (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img
                            src={country.flag}
                            alt={country.name}
                            style={{
                                width: '20px',
                                height: '15px',
                                marginRight: '8px',
                                objectFit: 'cover',
                            }}
                        />
                        {type === 'nationality'
                            ? `${country.nationality} (${country.name})`
                            : `${country.name}`}
                    </div>
                ),
                value: type === 'nationality' ? country.nationality : country.name,
            }))}
        />
    );
};

export default CountrySelect;