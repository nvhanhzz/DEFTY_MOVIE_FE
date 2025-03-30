import React, { useState, useEffect } from "react";
import { Select, message } from "antd";

const { Option } = Select;

interface VietnamAddressSelectorProps {
    onChange?: (address: string) => void;
    initialValue?: string;
    disabled?: boolean;
}

const VietnamAddressSelector: React.FC<VietnamAddressSelectorProps> = ({
                                                                           onChange,
                                                                           initialValue = "",
                                                                           disabled = false,
                                                                       }) => {
    const [provinces, setProvinces] = useState<any[]>([]);
    const [districts, setDistricts] = useState<any[]>([]);
    const [wards, setWards] = useState<any[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<string | undefined>(undefined);
    const [selectedDistrict, setSelectedDistrict] = useState<string | undefined>(undefined);
    const [selectedWard, setSelectedWard] = useState<string | undefined>(undefined);

    // Lấy danh sách tỉnh
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await fetch("https://provinces.open-api.vn/api/p/");
                const data = await response.json();
                setProvinces(data);
            } catch (error) {
                message.error("Failed to load provinces");
                console.error(error);
            }
        };
        fetchProvinces();
    }, []);

    // Lấy danh sách huyện khi chọn tỉnh
    useEffect(() => {
        if (selectedProvince) {
            const fetchDistricts = async () => {
                try {
                    const response = await fetch(
                        `https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`
                    );
                    const data = await response.json();
                    setDistricts(data.districts || []);
                    setWards([]);
                    if (!initialValue) {
                        setSelectedDistrict(undefined);
                        setSelectedWard(undefined);
                    }
                } catch (error) {
                    message.error("Failed to load districts");
                    console.error(error);
                }
            };
            fetchDistricts();
        } else {
            setDistricts([]);
            setWards([]);
            setSelectedDistrict(undefined);
            setSelectedWard(undefined);
        }
    }, [selectedProvince, initialValue]);

    // Lấy danh sách xã khi chọn huyện
    useEffect(() => {
        if (selectedDistrict) {
            const fetchWards = async () => {
                try {
                    const response = await fetch(
                        `https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`
                    );
                    const data = await response.json();
                    setWards(data.wards || []);
                    if (!initialValue) {
                        setSelectedWard(undefined);
                    }
                } catch (error) {
                    message.error("Failed to load wards");
                    console.error(error);
                }
            };
            fetchWards();
        } else {
            setWards([]);
            setSelectedWard(undefined);
        }
    }, [selectedDistrict, initialValue]);

    // Tạo chuỗi địa chỉ khi có thay đổi
    useEffect(() => {
        const addressParts = [
            selectedWard ? wards.find((w) => w.code === selectedWard)?.name : "",
            selectedDistrict ? districts.find((d) => d.code === selectedDistrict)?.name : "",
            selectedProvince ? provinces.find((p) => p.code === selectedProvince)?.name : "",
        ].filter(Boolean);

        const fullAddress = addressParts.join(" - ");
        if (onChange && fullAddress) {
            onChange(fullAddress);
        }
    }, [selectedProvince, selectedDistrict, selectedWard, provinces, districts, wards, onChange]);

    // Xử lý khi chọn tỉnh
    const handleProvinceChange = (value: string) => {
        setSelectedProvince(value);
        setSelectedDistrict(undefined); // Reset huyện
        setSelectedWard(undefined);     // Reset xã
        setDistricts([]);               // Reset danh sách huyện
        setWards([]);                   // Reset danh sách xã
    };

    // Xử lý khi chọn huyện
    const handleDistrictChange = (value: string) => {
        setSelectedDistrict(value);
        setSelectedWard(undefined);     // Reset xã
        setWards([]);                   // Reset danh sách xã
    };

    // Phân tích initialValue để điền giá trị ban đầu
    useEffect(() => {
        if (initialValue && provinces.length > 0 && !selectedProvince) {
            // Tách chuỗi theo " - " và giữ nguyên thứ tự: [Xã, Huyện, Tỉnh]
            const parts = initialValue.split(" - ");
            if (parts.length !== 3) {
                console.error("Invalid address format:", initialValue);
                return;
            }

            const wardName = parts[0].trim();
            const districtName = parts[1].trim();
            const provinceName = parts[2].trim();

            console.log("Parsed:", { wardName, districtName, provinceName }); // Debug

            // Tìm tỉnh
            const province = provinces.find((p) => p.name === provinceName);
            if (province) {
                setSelectedProvince(province.code);
                console.log("Province found:", province); // Debug

                // Tìm huyện
                fetch(`https://provinces.open-api.vn/api/p/${province.code}?depth=2`)
                    .then((res) => res.json())
                    .then((data) => {
                        const district = data.districts.find((d: any) => d.name === districtName);
                        if (district) {
                            setDistricts(data.districts);
                            setSelectedDistrict(district.code);
                            console.log("District found:", district); // Debug

                            // Tìm xã
                            fetch(`https://provinces.open-api.vn/api/d/${district.code}?depth=2`)
                                .then((res) => res.json())
                                .then((data) => {
                                    const ward = data.wards.find((w: any) => w.name === wardName);
                                    if (ward) {
                                        setWards(data.wards);
                                        setSelectedWard(ward.code);
                                        console.log("Ward found:", ward); // Debug
                                    } else {
                                        console.log("Ward not found:", wardName); // Debug
                                    }
                                });
                        } else {
                            console.log("District not found:", districtName); // Debug
                        }
                    });
            } else {
                console.log("Province not found:", provinceName); // Debug
            }
        }
    }, [initialValue, provinces]);



    return (
        <div style={{ display: "flex", gap: "8px", width: "100%" }}>
            <Select
                placeholder="Tỉnh/TP"
                value={selectedProvince}
                onChange={handleProvinceChange}
                disabled={disabled}
                style={{ flex: 1 }}
                showSearch
                filterOption={(input, option) =>
                    option?.children?.toString().toLowerCase().includes(input.toLowerCase()) || false
                }
            >
                {provinces.map((province) => (
                    <Option key={province.code} value={province.code}>
                        {province.name}
                    </Option>
                ))}
            </Select>

            <Select
                placeholder="Quận/Huyện"
                value={selectedDistrict}
                onChange={handleDistrictChange}
                disabled={disabled || !selectedProvince}
                style={{ flex: 1 }}
                showSearch
                filterOption={(input, option) =>
                    option?.children?.toString().toLowerCase().includes(input.toLowerCase()) || false
                }
            >
                {districts.map((district) => (
                    <Option key={district.code} value={district.code}>
                        {district.name}
                    </Option>
                ))}
            </Select>

            <Select
                placeholder="Phường/Xã"
                value={selectedWard}
                onChange={(value) => setSelectedWard(value)}
                disabled={disabled || !selectedDistrict}
                style={{ flex: 1 }}
                showSearch
                filterOption={(input, option) =>
                    option?.children?.toString().toLowerCase().includes(input.toLowerCase()) || false
                }
            >
                {wards.map((ward) => (
                    <Option key={ward.code} value={ward.code}>
                        {ward.name}
                    </Option>
                ))}
            </Select>
        </div>
    );
};

export default VietnamAddressSelector;