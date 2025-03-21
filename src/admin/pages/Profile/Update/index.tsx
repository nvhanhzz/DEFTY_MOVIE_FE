import React, {useEffect, useState} from "react";
import { useAdminSelector } from "../../../hooks/useAdminSelector.tsx";
import "./UpdateProfile.scss";
import {Button, Input, Form, DatePicker, message, Select} from "antd";
import AvtEditor from "../../../components/AvtEditor";
import {useTranslation} from "react-i18next";
import {AccountFormValues} from "../../Account/Create";
import dayjs from "dayjs";
import {getRoles} from "../../../services/roleSevice.tsx";
import {Role} from "../../Role";
import {updateProfile} from "../../../services/accountService.tsx";

const UpdateProfile: React.FC = () => {
    const { t } = useTranslation();
    const [file, setFile] = useState<File | null>(null);
    const [roles, setRoles] = useState([]);
    const currentAccount = useAdminSelector((state) => state.currentAccount.account);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await getRoles(1, 999999999);
                const data = await response.json();
                if (response.ok) {
                    setRoles(data.data.content);
                } else {
                    message.error('Failed to load roles');
                }
            } catch (error) {
                message.error('Error fetching roles');
                console.error(error);
            }
        };

        fetchRoles();
    }, []);

    const handleResetForm = () => {
        form.resetFields();
        setFile(null);
    };

    const handleSubmit = async (values: AccountFormValues) => {
        const formData = new FormData();
        formData.append("fullName", values.fullName);
        formData.append("username", values.username);
        formData.append("email", values.email);
        formData.append("phone", values.phone);
        formData.append("gender", values.gender);
        formData.append("address", values.address);
        if (file) {
            formData.append("avatar", file);
        }

        try {
            const response = await updateProfile(formData);
            console.log(response);

            console.log("FormData Sent: ", formData);
            message.success("Profile updated successfully!");
        } catch (error) {
            message.error("Failed to update profile. Please try again.");
        }
    };

    const handleAvatarSave = (file: File | null) => {
        setFile(file);
    };

    if (!currentAccount) return <div>Loading...</div>;

    return (
        <div className="update-profile-container">
            <Form
                form={form}
                layout="vertical"
                className="profile-form"
                initialValues={{
                    fullName: currentAccount.fullName,
                    username: currentAccount.username,
                    email: currentAccount.email,
                    phone: currentAccount.phone,
                    gender: currentAccount.gender,
                    address: currentAccount.address,
                    role: currentAccount.role,
                    datePicker: currentAccount.dateOfBirth ? dayjs(currentAccount.dateOfBirth) : null,
                }}
                onFinish={handleSubmit}
            >
                <div className="profile-header">
                    <Form.Item label={t('admin.account.avatar')} className="avatar-wrapper">
                        <AvtEditor onSave={handleAvatarSave} initialImage={currentAccount.avatar as string} />
                    </Form.Item>
                </div>

                <div className="profile-details">
                    <div className="left-column">
                        <Form.Item
                            label={t('admin.account.fullName')}
                            name="fullName"
                            rules={[{ required: true, message: t('admin.account.validation.fullName') }]}
                        >
                            <Input placeholder="Enter your full name" />
                        </Form.Item>

                        <Form.Item
                            label={t('admin.account.username')}
                            name="username"
                        >
                            <Input disabled/>
                        </Form.Item>

                        <Form.Item
                            label={t('admin.account.password')}
                            name="password"
                        >
                            <Input.Password placeholder="Enter your password" />
                        </Form.Item>

                        <Form.Item
                            label={t('admin.account.role.title')}
                            name="role"
                        >
                            <Select placeholder={t('admin.account.role.placeholder')}>
                                {roles.map((role: Role) => (
                                    <Select.Option key={role.id} value={role.name}>
                                        {role.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>

                    <div className="right-column">
                        <Form.Item
                            label={t('admin.account.email')}
                            name="email"
                            rules={[
                                { type: "email", message: "Please enter a valid email" },
                            ]}
                        >
                            <Input placeholder="Enter your email" />
                        </Form.Item>

                        <Form.Item
                            label={t('admin.account.phone')}
                            name="phone"
                        >
                            <Input placeholder="Enter your phone number" />
                        </Form.Item>

                        <Form.Item
                            label={t('admin.actor.dateOfBirth')}
                            name="datePicker"
                        >
                            <DatePicker
                                format="YYYY-MM-DD"
                                onChange={(_date, dateString) => form.setFieldsValue({ dateOfBirth: dateString })}
                            />
                        </Form.Item>

                        <Form.Item
                            label={t('admin.account.gender.title')}
                            name="gender"
                        >
                            <Select placeholder={t('admin.actor.gender.placeholder')}>
                                <Select.Option value="male">{t('admin.account.gender.male')}</Select.Option>
                                <Select.Option value="female">{t('admin.account.gender.female')}</Select.Option>
                                <Select.Option value="other">{t('admin.account.gender.other')}</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>

                    <div className="all-column">
                        <Form.Item
                            label={t('admin.account.address')}
                            name="address"
                        >
                            <Input.TextArea placeholder="Enter your address" rows={2} />
                        </Form.Item>
                    </div>
                </div>

                <Form.Item style={{ textAlign: "center", marginTop: "20px" }}>
                    <Button
                        htmlType="button"
                        onClick={handleResetForm}
                        className="reset-button"
                    >
                        {t('admin.form.reset')}
                    </Button>
                    <Button type="primary" htmlType="submit">
                        {t('admin.form.update')}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default UpdateProfile;