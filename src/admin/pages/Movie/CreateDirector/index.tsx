import { useEffect, useState } from "react";
import { Modal, Input, Select, DatePicker, Upload, Form, Row, Col, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { DirectorFromValues } from "../../Director/Create";
import { postDirector } from "../../../services/directorService.tsx";
import {RcFile, UploadChangeParam} from "antd/es/upload";
import { useNavigate } from "react-router-dom";
import "./CreateDirector.scss";

const PREFIX_URL_ADMIN: string = import.meta.env.VITE_PREFIX_URL_ADMIN as string;

interface AddDirectorPopupProps {
    visible: boolean;
    onCancel: () => void;
    onAdd: (directorData: DirectorFromValues) => void;
}

const AddDirectorPopup = ({ visible, onCancel, onAdd }: AddDirectorPopupProps) => {
    const [form] = Form.useForm();
    const [avatar, setAvatar] = useState<RcFile | null>(null);
    const [nation, setNation] = useState([]);
    const [file, setFile] = useState<RcFile | null>(null);
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await fetch("https://restcountries.com/v3.1/all");
                if (!response.ok) {
                    throw new Error("Failed to fetch countries");
                }
                const data = await response.json();
                const countries = data
                    .map((country: { name: { common: string }; cca2: string }) => ({
                        label: country.name.common,
                        value: country.name.common,
                    }))
                    .sort((a: { label: string; }, b: { label: never; }) => a.label.localeCompare(b.label));
                setNation(countries);
            } catch (error) {
                console.error(error);
            }
        };
        fetchCountries();
    }, []);

    const handleAdd = async (values: DirectorFromValues) => {
        console.log(values);
        try {
            const formData = new FormData();
            formData.append("fullName", values.fullName);
            formData.append("gender", values.gender);
            formData.append("dateOfBirth", values.dateOfBirth);
            // formData.append("weight", String(values.weight));
            // formData.append("height", String(values.height));
            formData.append("nationality", values.nationality);
            // formData.append("description", values.description);
            if (file) {
                formData.append("avatar", file);
            }

            const response = await postDirector(formData);
            if (!response.ok) {
                message.error(t("admin.message.createError"));
                console.log(response);
                return;
            }

            message.success(t("admin.message.createSuccess"));
            navigate(`${PREFIX_URL_ADMIN}/movies/create`);
            onAdd(values);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAvatarChange = ({ file }: UploadChangeParam) => {
        if (file.status === 'done') {
            message.success(`${file.name} file uploaded successfully`);
        } else if (file.status === 'error') {
            message.error(`${file.name} file upload failed.`);
        }
        // @ts-ignore
        setFile(file);
    };

    const handleResetForm = () => {
        form.resetFields();
        setAvatar(null);
        setFile(null); // Reset the file state
    };

    const handleModalCancel = () => {
        handleResetForm();
        onCancel();
    };

    return (
        <Modal
            className="add-director-popup"
            title={t("admin.director.create.title")}
            open={visible}
            onCancel={handleModalCancel}
            onOk={() => form.submit()}
            okText={t("admin.form.create")}
            cancelText={t("admin.form.reset")}
            width={800}
        >
            <Form form={form} layout="vertical" onFinish={handleAdd}>
                <Row gutter={32}>
                    <Col span={16}>
                        <Form.Item
                            label={t("admin.director.fullName")}
                            name="fullName"
                            rules={[{ required: true, message: t("admin.director.create.validation.fullName") }]}
                        >
                            <Input placeholder={t("admin.director.create.validation.fullName")} />
                        </Form.Item>

                        <Form.Item
                            label={t("admin.director.gender.title")}
                            name="gender"
                            rules={[{ required: true, message: t("admin.director.create.validation.gender") }]}
                        >
                            <Select placeholder={t("admin.director.gender.placeholder")}>
                                <Select.Option value="male">{t("admin.director.gender.male")}</Select.Option>
                                <Select.Option value="female">{t("admin.director.gender.female")}</Select.Option>
                                <Select.Option value="other">{t("admin.director.gender.other")}</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label={t("admin.director.dateOfBirth")}
                            name="dateOfBirth" // Change 'dob' to 'dateOfBirth'
                            rules={[{ required: true, message: t("admin.director.create.validation.dateOfBirth") }]}
                        >
                            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
                        </Form.Item>

                        <Form.Item
                            label={t("admin.movie.nation")}
                            name="nationality"
                            rules={[{ required: true, message: t("admin.movie.validation.nation") }]}
                        >
                            <Select
                                options={nation}
                                placeholder={t('admin.movie.placeholder.nation')}
                                showSearch
                                filterOption={(input, option) => {
                                    // @ts-ignore
                                    if (option && option.label) {
                                        // @ts-ignore
                                        return option.label.toLowerCase().includes(input.toLowerCase());
                                    }
                                    return false;
                                }}
                            />

                        </Form.Item>
                    </Col>

                    <Col span={8} className="avatar-col">
                        <Form.Item label="Avatar" name="avatar">
                            <Upload
                                listType="picture-card"
                                beforeUpload={() => false}
                                onChange={handleAvatarChange}
                                showUploadList={false}
                            >
                                {avatar ? (
                                    <img src={URL.createObjectURL(avatar)} alt="Avatar" style={{ width: "100%" }} />
                                ) : (
                                    <div>
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>Tải lên</div>
                                    </div>
                                )}
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default AddDirectorPopup;
