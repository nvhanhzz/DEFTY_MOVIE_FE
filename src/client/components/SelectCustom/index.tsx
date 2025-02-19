import React, { useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import "./SelectCustom.scss";

const options = [
    "889-912",
    "913-936",
    "937-960",
    "961-984",
    "985-1008",
    "1009-1032",
    "1033-1056",
    "1057-1080",
    "1081-1104",
    "1105-1123",
];

const SelectCustom: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(options[0]);

    const toggleDropdown = () => setIsOpen(!isOpen);
    const handleSelect = (option: string) => {
        setSelected(option);
        setIsOpen(false);
    };

    return (
        <div className="custom-select">
            <div className="select-header" onClick={toggleDropdown}>
                <span>{`Episodes ${selected}`}</span>
                <DownOutlined className={`icon ${isOpen ? "open" : ""}`} />
            </div>
            {isOpen && (
                <ul className="select-options">
                    {options.map((option, index) => (
                        <li
                            key={index}
                            className={selected === option ? "selected" : ""}
                            onClick={() => handleSelect(option)}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SelectCustom;