import React, { useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import "./SelectCustom.scss";

interface SelectCustomProps {
    options: string[];
    selectedIndex: number;
    onSelect: (index: number) => void;
}

const SelectCustom: React.FC<SelectCustomProps> = ({ options, selectedIndex, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);

    return (
        <div className="custom-select">
            <div className="select-header" onClick={toggleDropdown}>
                <span>{`Episodes ${options[selectedIndex]}`}</span>
                <DownOutlined className={`icon ${isOpen ? "open" : ""}`} />
            </div>
            {isOpen && (
                <ul className="select-options">
                    {options.map((option, index) => (
                        <li
                            key={index}
                            className={index === selectedIndex ? "selected" : ""}
                            onClick={() => {
                                onSelect(index);
                                setIsOpen(false);
                            }}
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