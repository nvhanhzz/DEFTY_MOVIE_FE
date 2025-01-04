import React from 'react';
import dayjs from 'dayjs'; // Import Day.js
import type { DatePickerProps } from 'antd';
import { DatePicker, Space } from 'antd';
import "./Test.scss";

const App: React.FC = () => {
    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        if (date) {
            console.log("Formatted Date:", dayjs(date).format('YYYY-MM-DD')); // Định dạng ngày
        }
        console.log("Raw Date String:", dateString); // Chuỗi ngày thô
    };

    return (
        <Space direction="vertical" className={'test'}>
            <DatePicker onChange={onChange} />
        </Space>
    );
};

export default App;