import React, { useEffect, useState } from "react";
import { useAdminSelector } from "../../../hooks/useAdminSelector.tsx";
import "./UpdateProfile.scss";
import { Button, DatePicker, Form, Input, message, Select } from "antd";
import AvtEditor from "../../../components/AvtEditor";
import VietnamAddressSelector from "../../../components/VietnamAddressSelector";
import { useTranslation } from "react-i18next";
import { AccountFormValues } from "../../Account/Create";
import dayjs from "dayjs";
import { updateProfile } from "../../../services/accountService.tsx";

const UpdateProfile: React.FC = () => {
    const { t } = useTranslation();
    const [file, setFile] = useState<File | null>(null);
    const [initialFile] = useState<File | null>(null);
    const [isEditable, setIsEditable] = useState(false);
    const [loading, setLoading] = useState(false);
    const currentAccount = useAdminSelector((state) => state.currentAccount.account);
    const [form] = Form.useForm();
    const [address, setAddress] = useState<string>("");
    const [initialAddress] = useState<string>(currentAccount?.address || "");

    const handleResetForm = () => {
        form.resetFields();
        setFile(initialFile);
        setAddress(initialAddress);
    };

    const handleSubmit = async (values: AccountFormValues) => {
        setLoading(true);
        const formData = new FormData();
        formData.append("fullName", values.fullName);
        formData.append("username", values.username);
        formData.append("email", values.email);
        formData.append("phone", values.phone);
        formData.append("gender", values.gender);
        formData.append("dateOfBirth", values.dateOfBirth ? dayjs(values.dateOfBirth).format("YYYY-MM-DD") : "");

        if (address) {
            formData.append("address", address);
        } else {
            formData.append("address", currentAccount.address || "");
        }

        if (file) {
            formData.append("avatar", file);
        }

        try {
            const response = await updateProfile(formData);
            if (!response.ok || response.status !== 200) {
                message.error(t("admin.message.updateError"));
                return;
            }
            message.success("Profile updated successfully!");
            setIsEditable(false);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            message.error(t('admin.message.updateError'));
        }
    };

    const handleAvatarSave = (file: File | null) => {
        setFile(file);
    };

    const toggleEdit = () => {
        if (isEditable) {
            handleResetForm();
        }
        setIsEditable(!isEditable);
    };

    useEffect(() => {
        if (currentAccount) {
            form.setFieldsValue({
                fullName: currentAccount.fullName,
                username: currentAccount.username,
                email: currentAccount.email,
                phone: currentAccount.phone,
                gender: currentAccount.gender,
                dateOfBirth: currentAccount.dateOfBirth ? dayjs(currentAccount.dateOfBirth) : null,
            });
            setAddress(currentAccount.address || "");
        }
    }, [currentAccount, form]);

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
                    dateOfBirth: currentAccount.dateOfBirth ? dayjs(currentAccount.dateOfBirth) : null,
                }}
                onFinish={handleSubmit}
            >
                <div className="profile-header">
                    <Form.Item label={t("admin.account.avatar")} className="avatar-wrapper">
                        <AvtEditor
                            onSave={handleAvatarSave}
                            initialImage={currentAccount.avatar as string}
                            disabled={!isEditable}
                        />
                    </Form.Item>
                </div>

                <div className="profile-details">
                    <div className="left-column">
                        <Form.Item
                            label={t("admin.account.fullName")}
                            name="fullName"
                            rules={[{ required: true, message: t("admin.account.validation.fullName") }]}
                        >
                            <Input placeholder="Enter your full name" disabled={!isEditable} />
                        </Form.Item>

                        <Form.Item label={t("admin.account.username")} name="username">
                            <Input disabled />
                        </Form.Item>

                        <Form.Item label={t("admin.account.address")}>
                            <VietnamAddressSelector
                                onChange={(value) => setAddress(value)}
                                initialValue={address}
                                disabled={!isEditable}
                            />
                        </Form.Item>
                    </div>

                    <div className="right-column">
                        <Form.Item
                            label={t("admin.account.email")}
                            name="email"
                            rules={[{ type: "email", message: "Please enter a valid email" }]}
                        >
                            <Input placeholder="Enter your email" disabled={!isEditable} />
                        </Form.Item>

                        <Form.Item label={t("admin.account.phone")} name="phone">
                            <Input placeholder="Enter your phone number" disabled={!isEditable} />
                        </Form.Item>

                        <div style={{ display: "flex", gap: "10px" }}>
                            <Form.Item
                                label={t("admin.actor.dateOfBirth")}
                                name="dateOfBirth"
                                style={{ flex: 1 }}
                            >
                                <DatePicker
                                    format="YYYY-MM-DD"
                                    disabled={!isEditable}
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>

                            <Form.Item
                                label={t("admin.account.gender.title")}
                                name="gender"
                                style={{ flex: 1 }}
                            >
                                <Select placeholder={t("admin.actor.gender.placeholder")} disabled={!isEditable}>
                                    <Select.Option value="Male">{t("admin.account.gender.male")}</Select.Option>
                                    <Select.Option value="Female">{t("admin.account.gender.female")}</Select.Option>
                                    <Select.Option value="Other">{t("admin.account.gender.other")}</Select.Option>
                                </Select>
                            </Form.Item>
                        </div>
                    </div>
                </div>

                <Form.Item style={{ textAlign: "center", marginTop: "20px" }}>
                    <Button htmlType="button" onClick={handleResetForm} className="reset-button" disabled={!isEditable}>
                        {t("admin.form.reset")}
                    </Button>
                    <Button type="default" onClick={toggleEdit}>
                        {isEditable ? "Disable" : "Edit"}
                    </Button>
                    <Button type="primary" htmlType="submit" loading={loading}  disabled={!isEditable} style={{ marginLeft: "10px" }}>
                        {t("admin.form.update")}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default UpdateProfile;