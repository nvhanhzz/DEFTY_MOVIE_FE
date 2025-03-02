import React, {useEffect, useState} from "react";
import {Button, Col, Form, Input, message, Row, Select, Space} from "antd";
import {useNavigate, useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {SaveOutlined, UndoOutlined} from "@ant-design/icons";
import OutletTemplate from "../../../templates/Outlet";
import {getBannerById, updateBannerById} from "../../../services/bannerService.tsx";
import {BannerFromValues} from "../Create";
import AvtEditor from "../../../components/AvtEditor";

const PREFIX_URL_ADMIN: string = import.meta.env.VITE_PREFIX_URL_ADMIN as string;

const UpdateBanner: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [thumbnail, setThumbnail] = useState<string | null>(null);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        const fetchBanner = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const response = await getBannerById(id);
                const result = await response.json();
                if (response.ok && result.status === 200) {
                    const data = result.data;
                    form.setFieldsValue({
                        title: data.title,
                        link: data.link,
                        key: data.key,
                        position: data.position,
                        contentType: data.contentType,
                        contentId: data.contentId,
                    });
                    if (data.thumbnail) {
                        setThumbnail(data.thumbnail);
                    }
                } else {
                    message.error(t("admin.message.fetchError"));
                }
            } catch (e) {
                message.error(t("admin.message.fetchError"));
            } finally {
                setLoading(false);
            }
        };

        fetchBanner();
    }, [id, form, t]);

    const handleUpdateBanner = async (values: BannerFromValues) => {
        setLoading(true);
        try {
            if (!id) return;
            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("contentId", String(values.contentId));
            formData.append("link", values.link);
            formData.append("key", values.key);
            formData.append("position", String(values.position));
            formData.append("contentType", values.contentType);
            if (file) {
                formData.append("thumbnail", file);
            }

            const response = await updateBannerById(id, formData);
            const result = await response.json();
            if (!response.ok || result.status !== 200) {
                message.error(result.message || t("admin.message.updateError"));
                return;
            }

            message.success(t("admin.message.updateSuccess"));
            navigate(`${PREFIX_URL_ADMIN}/banners`);
        } catch (error) {
            message.error(t("admin.message.fetchError"));
        } finally {
            setLoading(false);
        }
    };

    const handleThumbnailSave = (file: File | null) => {
        setFile(file);
    };

    const handleResetForm = () => {
        form.resetFields();
        setFile(null);
        setThumbnail(null);
    };

    return (
        <OutletTemplate
            breadcrumbItems={[
                { path: `${PREFIX_URL_ADMIN}/dashboard`, name: t("admin.dashboard.title") },
                { path: `${PREFIX_URL_ADMIN}/banners`, name: t("admin.banner.title") },
                { path: "", name: t("admin.banner.update.title") },
            ]}
        >
                <Form form={form} onFinish={handleUpdateBanner} layout="vertical" style={{margin: "10px 20px"}}>
                    {/* Row 1: Title & Link */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label={t("admin.banner.title")}
                                name="title"
                                rules={[{ required: true, message: t("admin.banner.validation.title") }]}
                            >
                                <Input placeholder={t("admin.banner.placeholder.title")} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={t("admin.banner.link")}
                                name="link"
                                rules={[{ required: true, message: t("admin.banner.validation.link") }]}
                            >
                                <Input placeholder={t("admin.banner.placeholder.link")} />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Row 2: Position & Key */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label={t("admin.banner.position")}
                                name="position"
                                rules={[{ required: true, message: t("admin.banner.validation.position") }]}
                            >
                                <Input type="number" min={0} placeholder={t("admin.banner.placeholder.position")} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={t("admin.banner.key")}
                                name="key"
                                rules={[{ required: true, message: t("admin.banner.validation.key") }]}
                            >
                                <Input placeholder={t("admin.banner.placeholder.key")} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label={t("admin.banner.contentType")}
                                name="contentType"
                                rules={[{ required: true, message: t("admin.banner.validation.contentType") }]}
                            >
                                <Select placeholder={t("admin.banner.placeholder.contentType")}>
                                    <Select.Option disabled>--- Choose content Type ---</Select.Option>
                                    <Select.Option value="1">Movie</Select.Option>
                                    <Select.Option value="2">Category</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label={t("admin.banner.thumbnail")} className="thumbnail-wrapper">
                                <AvtEditor onSave={handleThumbnailSave}
                                           initialImage={thumbnail || "/assets/images/default-thumbnail.jpg"} shape="rectangle" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <div style={{ textAlign: "right", marginTop: "16px" }}>
                        <Space>
                            <Button icon={<UndoOutlined />} onClick={handleResetForm}>{t("admin.form.reset")}</Button>
                            <Button type="primary" icon={<SaveOutlined />} htmlType="submit" loading={loading}>{t("admin.form.update")}</Button>
                        </Space>
                    </div>
                </Form>
        </OutletTemplate>
    );
};

export default UpdateBanner;
