import React, { useState, useEffect } from "react";
import { Select, Spin } from "antd";

const { Option } = Select;

interface Country {
    name: string;
    flag: string;
}

interface NationalSelectProps {
    onChange: (value: string) => void;
}

const NationalSelect: React.FC<NationalSelectProps> = ({ onChange }) => {
    const [countries, setCountries] = useState<Country[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                setLoading(true);
                const response = await fetch("https://restcountries.com/v3.1/all");
                if (!response.ok) {
                    throw new Error("Failed to fetch country.js data");
                }
                const data = await response.json();
                const countryData: Country[] = data.map((country: any) => ({
                    name: country.name.common,
                    flag: country.flags.png,
                }));
                setCountries(countryData.sort((a, b) => a.name.localeCompare(b.name))); // Sort alphabetically
            } catch (error) {
                console.error("Error fetching countries:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCountries();
    }, []);

    return (
        <Select
            showSearch
            placeholder="Select a country"
            onChange={onChange}
            style={{ width: "100%" }}
            loading={loading}
            filterOption={(input, option) => {
                // Use `String(option?.children)` to convert ReactNode to a string
                const childrenString = String(option?.children);
                return childrenString.toLowerCase().includes(input.toLowerCase());
            }}
        >
            {loading ? (
                <Option value="" disabled>
                    <Spin /> Loading...
                </Option>
            ) : (
                countries.map((country) => (
                    <Option key={country.name} value={country.name}>
                        <img
                            src={country.flag}
                            alt={country.name}
                            style={{
                                width: "20px",
                                height: "15px",
                                marginRight: "8px",
                                border: "1px solid #ddd",
                            }}
                        />
                        {country.name}
                    </Option>
                ))
            )}
        </Select>
    );
};

export default NationalSelect;
