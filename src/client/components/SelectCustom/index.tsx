import React, { useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import "./SelectCustom.scss";

const options = [
    "...",
    "...",
    "...",
    "...",
    "...",
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