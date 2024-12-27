import React, {useEffect, useState} from "react";
import {Modal, Input, Select, DatePicker, Upload, Form, Row, Col, message} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "./CreateDirector.scss";
import { useTranslation } from "react-i18next";

const { Option } = Select;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const AddDirectorPopup = ({ visible, onCancel, onAdd }) => {
    const [form] = Form.useForm();
    const [avatar, setAvatar] = useState(null);
    const { t } = useTranslation();
    const [nation, setNation] = useState([]);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await fetch('https://restcountries.com/v3.1/all');
                if (!response.ok) {
                    throw new Error('Failed to fetch countries');
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
                message.error('Error fetching countries');
                console.error(error);
            }
        };
        fetchCountries();
    }, []);
    const handleAdd = () => {
        form.validateFields()
            .then(values => {
                const formData = {
                    ...values,
                    avatar,
                };

                onAdd(formData);
                form.resetFields();
                setAvatar(null);
            })
            .catch(info => {
                console.error("Validation failed:", info);
            });
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const handleAvatarChange = ({ file }) => {
        setAvatar(file);
    };

    const handleResetForm = () => {
        form.resetFields(); // Reset all form fields
        setAvatar(null); // Reset avatar
    };

    const handleModalCancel = () => {
        handleResetForm(); // Reset form when cancel is clicked
        onCancel(); // Close modal
    };

    return (
        <Modal
            className={"add-director-popup"}
            title={t('admin.director.create.title')}
            open={visible}
            onCancel={handleModalCancel}
            onOk={handleAdd}
            okText= {t('admin.form.create')}
            cancelText={t('admin.form.reset')}
            width={800}
        >
            <Form form={form} layout="vertical">
                <Row gutter={32}>
                    <Col span={16}>
                        <Form.Item
                            label={t('admin.director.fullName')}
                            name="fullName"
                            rules={[{ required: true, message: t('admin.director.create.validation.fullName') }]}
                        >
                            <Input placeholder={t('admin.director.create.validation.fullName')} />
                        </Form.Item>

                        <Form.Item
                            label={t('admin.director.gender.title')}
                            name="gender"
                            rules={[{ required: true, message: t('admin.director.create.validation.gender') }]}
                        >
                            <Select placeholder={t('admin.director.gender.placeholder')}>
                                <Select.Option value="male">{t('admin.director.gender.male')}</Select.Option>
                                <Select.Option value="female">{t('admin.director.gender.female')}</Select.Option>
                                <Select.Option value="other">{t('admin.director.gender.other')}</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label={t('admin.director.dateOfBirth')}
                            name="dob"
                            rules={[{ required: true, message: t('admin.director.create.validation.dateOfBirth') }]}
                        >
                            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
                        </Form.Item>

                        <Form.Item
                            label={t('admin.movie.nation')}
                            name="nation"
                            rules={[{ required: true, message: t('admin.movie.validation.nation') }]}
                        >
                            <Select
                                options={nation}
                                placeholder={t('admin.movie.placeholder.nation')}
                                showSearch
                                filterOption={(input, option) =>
                                    option.label.toLowerCase().includes(input.toLowerCase())
                                }
                            />
                        </Form.Item>
                    </Col>

                    {/* Phần Avatar bên phải */}
                    <Col span={8} className={"avatar-col"}>
                        <Form.Item label="Avatar" name="avatar">
                            <Upload
                                listType="picture-card"
                                beforeUpload={() => false}
                                onChange={handleAvatarChange}
                                showUploadList={false}
                            >
                                {avatar ? (
                                    <img
                                        src={URL.createObjectURL(avatar)}
                                        alt="Avatar"
                                        style={{ width: "100%" }}
                                    />
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
