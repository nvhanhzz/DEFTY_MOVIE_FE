import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message, Upload } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { updateMovieById, getMovieById } from '../../../services/movieService';
import OutletTemplate from '../../../templates/Outlet';
import { RcFile } from 'antd/es/upload';
import './UpdateMovie.scss';
import { UploadOutlined } from "@ant-design/icons";
import { MovieFormValues } from "../Create";
import { Movie } from "../index.tsx";

const PREFIX_URL_ADMIN: string = import.meta.env.VITE_PREFIX_URL_ADMIN as string;

const UpdateMovie: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<RcFile | null>(null);  // Dùng RcFile cho ảnh thumbnail mới
    const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null); // Lưu URL ảnh thumbnail
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();

    // Fetch movie data when the component mounts
    useEffect(() => {
        const fetchMovie = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const response = await getMovieById(id);
                const result = await response.json();
                if (response.ok) {
                    const movie: Movie = result.data;
                    form.setFieldsValue({
                        title: movie.title,
                        content: movie.content,
                        author: movie.author,
                    });

                    // Lưu URL thumbnail nếu có
                    if (movie.thumbnail) {
                        setThumbnailUrl(movie.thumbnail);  // Lưu URL ảnh cũ
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

        fetchMovie();
    }, [id, form, t]);

    // Handle form submission
    const handleUpdateMovie = async (values: MovieFormValues) => {
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

            const response = await updateMovieById(id, formData);
            const result = await response.json();
            if (!response.ok) {
                message.error(result.message || t('admin.message.updateError'));
                return;
            }

            message.success(t('admin.message.updateSuccess'));
            navigate(`${PREFIX_URL_ADMIN}/movies`);  // Sau khi update, điều hướng đến danh sách bài viết
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
                { path: `${PREFIX_URL_ADMIN}/movies`, name: t('admin.movie.title') },
                { path: '', name: t('admin.movie.update.title') },
            ]}
        >
            <Form
                form={form}
                onFinish={handleUpdateMovie}
                layout="vertical"
                className="update-movie-form"
            >
                <Form.Item
                    label={t('admin.movie.title')}
                    name="title"
                    rules={[{ required: true, message: t('admin.movie.validation.title') }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t('admin.movie.content')}
                    name="content"
                    rules={[{ required: true, message: t('admin.movie.validation.content') }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t('admin.movie.author')}
                    name="author"
                    rules={[{ required: true, message: t('admin.movie.validation.author') }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item label={t('admin.movie.thumbnail')} className="thumbnail-wrapper">
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

export default UpdateMovie;
