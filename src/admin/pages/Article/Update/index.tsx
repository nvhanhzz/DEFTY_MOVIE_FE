import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message, Upload } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { updateArticleById, getArticleById } from '../../../services/articleService';
import OutletTemplate from '../../../templates/Outlet';
import { RcFile } from 'antd/es/upload';
import './UpdateArticle.scss';
import { UploadOutlined } from "@ant-design/icons";
import { ArticleFormValues } from "../Create";
import { Article } from "../index.tsx";

const PREFIX_URL_ADMIN: string = import.meta.env.VITE_PREFIX_URL_ADMIN as string;

const UpdateArticle: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<RcFile | null>(null);  // Dùng RcFile cho ảnh thumbnail mới
    const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null); // Lưu URL ảnh thumbnail
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();

    // Fetch article data when the component mounts
    useEffect(() => {
        const fetchArticle = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const response = await getArticleById(id);
                const result = await response.json();
                if (response.ok) {
                    const article: Article = result.data;
                    form.setFieldsValue({
                        title: article.title,
                        content: article.content,
                        author: article.author,
                    });

                    // Lưu URL thumbnail nếu có
                    if (article.thumbnail) {
                        setThumbnailUrl(article.thumbnail);  // Lưu URL ảnh cũ
                    }
                } else {
                    message.error(t('admin.message.fetchError'));
                }
            } catch (error) {
                message.error(t('admin.message.fetchError'));
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [id, form, t]);

    // Handle form submission
    const handleUpdateArticle = async (values: ArticleFormValues) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('content', values.content);
            formData.append('author', values.author);

            // Nếu có file mới, append nó vào formData
            if (file) {
                formData.append('thumbnail', file);
            } else {
                // Nếu không có file mới, gửi lại URL thumbnail cũ
                if (thumbnailUrl) {
                    formData.append('thumbnail', thumbnailUrl);
                }
            }

            const response = await updateArticleById(id, formData);
            const result = await response.json();
            if (!response.ok) {
                message.error(result.message || t('admin.message.updateError'));
                return;
            }

            message.success(t('admin.message.updateSuccess'));
            navigate(`${PREFIX_URL_ADMIN}/articles`);  // Sau khi update, điều hướng đến danh sách bài viết
        } catch (error) {
            message.error(t('admin.message.fetchError'));
        } finally {
            setLoading(false);
        }
    };

    // Handle file change (thumbnail)
    const handleThumbnailChange = ({ file }: { file: RcFile }) => {
        setFile(file);  // Lưu file nếu người dùng chọn ảnh mới
    };

    // Handle form reset
    const handleResetForm = () => {
        form.resetFields();
        setFile(null);  // Reset file mới
        setThumbnailUrl(null);  // Reset URL thumbnail (nếu cần)
    };

    return (
        <OutletTemplate
            breadcrumbItems={[
                { path: `${PREFIX_URL_ADMIN}/dashboard`, name: t('admin.dashboard.title') },
                { path: `${PREFIX_URL_ADMIN}/articles`, name: t('admin.article.title') },
                { path: '', name: t('admin.article.update.title') },
            ]}
        >
            <Form
                form={form}
                onFinish={handleUpdateArticle}
                layout="vertical"
                className="update-article-form"
            >
                <Form.Item
                    label={t('admin.article.title')}
                    name="title"
                    rules={[{ required: true, message: t('admin.article.validation.title') }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t('admin.article.content')}
                    name="content"
                    rules={[{ required: true, message: t('admin.article.validation.content') }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t('admin.article.author')}
                    name="author"
                    rules={[{ required: true, message: t('admin.article.validation.author') }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item label={t('admin.article.thumbnail')} className="thumbnail-wrapper">
                    <div className="thumbnail-preview">
                        <Upload
                            listType="picture-card"
                            beforeUpload={(file) => {
                                handleThumbnailChange({ file });
                                return false;  // Không cho phép upload tự động
                            }}
                            className="thumbnail-uploader"
                            showUploadList={false}  // Ẩn danh sách file sau khi upload
                        >
                            {/* Hiển thị ảnh thumbnail từ URL hoặc file mới */}
                            <img
                                src={file ? URL.createObjectURL(file) : thumbnailUrl || 'https://via.placeholder.com/150'}
                                alt="thumbnail"
                                className="thumbnail-image"
                            />
                        </Upload>
                        <Button className="upload-button">
                            <UploadOutlined /> {t('admin.account.upload')}
                        </Button>
                    </div>
                </Form.Item>

                <div className="form-actions">
                    <Button
                        htmlType="button"
                        onClick={handleResetForm}  // Reset form and thumbnail
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
                        {t('admin.form.update')}
                    </Button>
                </div>
            </Form>
        </OutletTemplate>
    );
};

export default UpdateArticle;
