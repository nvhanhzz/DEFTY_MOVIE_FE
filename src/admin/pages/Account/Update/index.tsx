import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message, Upload, DatePicker, Select, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import OutletTemplate from '../../../templates/Outlet';
import { getAccountById, updateAccountById } from "../../../services/accountService";
import { getRoles } from "../../../services/roleSevice.tsx";
import './UpdateAccount.scss';
import { RcFile } from "antd/es/upload";
import { Role } from "../../Role";
import { AccountFormValues } from "../Create";
import { Account } from "../index.tsx";
import dayjs from 'dayjs';

const PREFIX_URL_ADMIN: string = import.meta.env.VITE_PREFIX_URL_ADMIN as string;

const UpdateAccount: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<RcFile | null>(null);
    const [roles, setRoles] = useState<Role[]>([]);
    const [form] = Form.useForm();
    const { t } = useTranslation();

    // Fetch dữ liệu tài khoản và roles
    useEffect(() => {
        const fetchAccount = async () => {
            try {
                const response = await getAccountById(id as string);
                const result = await response.json();
                if (response.ok && result.status === 200) {
                    const data: Account = result.data;
                    form.setFieldsValue({
                        fullName: data.fullName,
                        email: data.email,
                        username: data.username,
                        phone: data.phone,
                        gender: data.gender,
                        role: data.role,
                        dateOfBirth: data.dateOfBirth,
                        datePicker: data.dateOfBirth ? dayjs(data.dateOfBirth) : null,  // Chuyển thành đối tượng dayjs nếu có
                    });
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (e) {
                message.error('Error fetching account data');
            }
        }

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
        fetchAccount();
    }, [id, form]);

    // Hàm xử lý khi cập nhật tài khoản
    const handleUpdateAccount = async (values: AccountFormValues) => {
        console.log(values);
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('username', values.username);
            formData.append('email', values.email);
            formData.append('fullName', values.fullName);
            formData.append('phone', values.phone);
            formData.append('gender', values.gender);
            formData.append('address', values.address);
            formData.append('dateOfBirth', values.dateOfBirth);
            formData.append('password', values.password);
            formData.append('role', values.role);  // Gửi role người dùng chọn
            if (file) {
                formData.append('avatar', file);
            }

            const response = await updateAccountById(id as string, formData);
            const result = await response.json();
            if (!response.ok) {
                message.error(result.message || t('admin.message.createError'));
                return;
            }
            if (result.status !== 201) {
                message.error(result.message || t('admin.message.createError'));
                return;
            }

            message.success(t('admin.message.createSuccess'));
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            message.error(t('admin.message.fetchError'));
        } finally {
            setLoading(false);
        }
    };

    // Hàm xử lý khi chọn avatar
    const handleAvatarChange = ({ file }: { file: RcFile }) => {
        setFile(file);
    };

    // Hàm xử lý khi reset form, bao gồm reset avatar
    const handleResetForm = () => {
        form.resetFields();  // Reset các trường trong form
        setFile(null);       // Reset avatar về null
    };

    return (
        <OutletTemplate
            breadcrumbItems={[
                { path: `${PREFIX_URL_ADMIN}/dashboard`, name: t('admin.dashboard.title') },
                { path: `${PREFIX_URL_ADMIN}/accounts`, name: t('admin.account.title') },
                { path: ``, name: t('admin.account.update.title') },
            ]}
        >
            <Form
                form={form}
                onFinish={handleUpdateAccount}
                layout="vertical"
                className="create-account-form"
            >
                <Row gutter={10}>
                    <Col span={16}>
                        <Form.Item
                            label={t('admin.account.fullName')}
                            name="fullName"
                            rules={[{ required: true, message: t('admin.account.validation.fullName') }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label={t('admin.account.email')}
                            name="email"
                            rules={[{ required: true, message: t('admin.account.validation.email') }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label={t('admin.account.username')}
                            name="username"
                            rules={[{ required: true, message: t('admin.account.validation.username') }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label={t('admin.account.phone')}
                            name="phone"
                            rules={[{ required: true, message: t('admin.account.validation.phone') }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label={t('admin.account.password')}
                            name="password"
                            rules={[{ message: t('admin.account.validation.password') }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            label={t('admin.account.dateOfBirth')}
                            name="datePicker"
                            rules={[{ required: true, message: t('admin.account.validation.dateOfBirth') }]}
                        >
                            <DatePicker
                                format="YYYY-MM-DD"
                            />
                        </Form.Item>

                        <Form.Item name="dateOfBirth" style={{ display: 'none' }}>
                            <Input type="hidden" />
                        </Form.Item>

                        <Form.Item
                            label={t('admin.account.gender.title')}
                            name="gender"
                            rules={[{ required: true, message: t('admin.account.validation.gender') }]}
                        >
                            <Select placeholder={t('admin.account.gender.placeholder')}>
                                <Select.Option value="male">{t('admin.account.gender.male')}</Select.Option>
                                <Select.Option value="female">{t('admin.account.gender.female')}</Select.Option>
                                <Select.Option value="other">{t('admin.account.gender.other')}</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label={t('admin.account.role.title')}
                            name="role"
                            rules={[{ required: true, message: t('admin.account.validation.role') }]}
                        >
                            <Select placeholder={t('admin.account.role.placeholder')}>
                                {roles.map((role: Role) => (
                                    <Select.Option key={role.id} value={role.name}>
                                        {role.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={8} className="avatar-col">
                        <Form.Item label={t('admin.account.avatar')} className="avatar-wrapper">
                            <div className="avatar-preview">
                                <Upload
                                    listType="picture-card"
                                    beforeUpload={(file) => {
                                        handleAvatarChange({ file });
                                        return false;  // Không cho phép upload tự động
                                    }}
                                    className="avatar-uploader"
                                    showUploadList={false}  // Ẩn danh sách file sau khi upload
                                >
                                    <img
                                        src={file ? URL.createObjectURL(file as Blob) : 'https://th.bing.com/th/id/OIP.lMA6AEzLnoPpw177nVhYZgHaHa?pid=ImgDet&w=184&h=184&c=7&dpr=1.3'}
                                        alt="avatar"
                                        className="avatar-image"
                                    />
                                </Upload>
                                <Button className="upload-button">
                                    <UploadOutlined /> {t('admin.account.upload')}
                                </Button>
                            </div>
                        </Form.Item>
                    </Col>
                </Row>
                <div className="form-actions">
                    <Button
                        htmlType="button"
                        onClick={handleResetForm}  // Gọi hàm reset khi bấm nút Reset
                        className="reset-button"
                    >
                        {t('admin.form.reset')}
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        className="submit-button"
                    >
                        {t('admin.form.submit')}
                    </Button>
                </div>
            </Form>
        </OutletTemplate>
    );
};

export default UpdateAccount;
