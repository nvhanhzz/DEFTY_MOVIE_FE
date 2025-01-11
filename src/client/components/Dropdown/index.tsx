import React from 'react';
import './Dropdown.scss';

interface DropdownProps {
    trigger: React.ReactNode; // Phần trigger được truyền từ bên ngoài
    children: React.ReactNode; // Nội dung dropdown
}

const Dropdown: React.FC<DropdownProps> = ({ trigger, children }) => {
    return (
        <div className="dropdown">
            <div className="dropdown__trigger">
                {trigger} {/* Phần trigger hiển thị */}
            </div>
            <div className="dropdown__menu">
                {children} {/* Nội dung dropdown */}
            </div>
        </div>
    );
};

export default Dropdown;
