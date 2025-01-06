import React, { useState } from 'react';
import { Button, Form, Input, message, Upload, DatePicker, Select, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import OutletTemplate from '../../../templates/Outlet';
import './CreateActor.scss';
import { RcFile } from "antd/es/upload";
import {postActor} from "../../../services/actorService.tsx";

const PREFIX_URL_ADMIN: string = import.meta.env.VITE_PREFIX_URL_ADMIN as string;

export interface ActorFromValues {
    fullName: string;
    gender: string;
    dateOfBirth: string;
    weight: number;
    height: number;
    nationality: string;
    description: string;
    avatar?: RcFile;
}

const CreateActor: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<RcFile | null>(null);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleCreateAccount = async (values: ActorFromValues) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('fullName', values.fullName);
            formData.append('gender', values.gender);
            formData.append('dateOfBirth', values.dateOfBirth);
            formData.append('weight', String(values.weight));
            formData.append('height', String(values.height));
            formData.append('nationality', values.nationality);
            formData.append('description', values.description);
            if (file) {
                formData.append('avatar', file);
            }

            const response = await postActor(formData);
            const result = await response.json();
            if (!response.ok || result.status !== 201) {
                message.error(result.message || t('admin.message.createError'));
                return;
            }

            message.success(t('admin.message.createSuccess'));
            navigate(`${PREFIX_URL_ADMIN}/actors`);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            message.error(t('admin.message.fetchError'));
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarChange = ({ file }: { file: RcFile }) => {
        setFile(file);
    };

    const handleResetForm = () => {
        form.resetFields();
        setFile(null);
    };

    return (
        <OutletTemplate
            breadcrumbItems={[
                { path: `${PREFIX_URL_ADMIN}/dashboard`, name: t('admin.dashboard.title') },
                { path: `${PREFIX_URL_ADMIN}/actors`, name: t('admin.actor.title') },
                { path: ``, name: t('admin.actor.create.title') },
            ]}
        >
            <Form
                form={form}
                onFinish={handleCreateAccount}
                layout="vertical"
                className="create-account-form"
            >
                <Row gutter={10}>
                    <Col span={16}>
                        <Form.Item
                            label={t('admin.actor.fullName')}
                            name="fullName"
                            rules={[{ required: true, message: t('admin.actor.create.validation.fullName') }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label={t('admin.actor.dateOfBirth')}
                            name="datePicker"
                            rules={[{ required: true, message: t('admin.actor.create.validation.dateOfBirth') }]}
                        >
                            <DatePicker
                                format="YYYY-MM-DD"
                                onChange={(_date, dateString) => form.setFieldsValue({ dateOfBirth: dateString })}
                            />
                        </Form.Item>

                        <Form.Item
                            label={t('admin.actor.gender.title')}
                            name="gender"
                            rules={[{ required: true, message: t('admin.actor.create.validation.gender') }]}
                        >
                            <Select placeholder={t('admin.actor.gender.placeholder')}>
                                <Select.Option value="male">{t('admin.actor.gender.male')}</Select.Option>
                                <Select.Option value="female">{t('admin.actor.gender.female')}</Select.Option>
                                <Select.Option value="other">{t('admin.actor.gender.other')}</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label={t('admin.actor.weight')}
                            name="weight"
                            rules={[{ required: true, message: t('admin.actor.create.validation.weight') }]}
                        >
                            <Input type="number" min={0} />
                        </Form.Item>

                        <Form.Item
                            label={t('admin.actor.height')}
                            name="height"
                            rules={[{ required: true, message: t('admin.actor.create.validation.height') }]}
                        >
                            <Input type="number" min={0}/>
                        </Form.Item>

                        <Form.Item
                            label={t('admin.actor.nationality')}
                            name="nationality"
                            rules={[{ required: true, message: t('admin.actor.create.validation.nationality') }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label={t('admin.actor.description')}
                            name="description"
                            rules={[{ required: true, message: t('admin.actor.create.validation.description') }]}
                        >
                            <Input.TextArea />
                        </Form.Item>
                    </Col>

                    <Col span={8} className="avatar-col">
                        <Form.Item label={t('admin.actor.avatar')} className="avatar-wrapper">
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
                                    <UploadOutlined /> {t('admin.actor.upload')}
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
                        {t('admin.form.create')}
                    </Button>
                </div>
            </Form>
        </OutletTemplate>
    );
};

export default CreateActor;