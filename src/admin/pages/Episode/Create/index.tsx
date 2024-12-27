import React, { useState } from 'react';
import { Button, Form, message, Upload, Input } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import OutletTemplate from '../../../templates/Outlet';
import { RcFile } from "antd/es/upload";
import { postEpisode } from "../../../services/episodeService.tsx";
import "./CreateEpisode.scss";

const PREFIX_URL_ADMIN: string = import.meta.env.VITE_PREFIX_URL_ADMIN as string;

export interface EpisodeFormValues {
    number: number;
    description: string;
    thumbnail?: RcFile;
    link?: RcFile;
    movieId: string;
}

const CreateEpisode: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [thumbnailFile, setThumbnailFile] = useState<RcFile | null>(null);
    const [videoFile, setVideoFile] = useState<RcFile | null>(null);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { id: movieId } = useParams<{ id: string }>(); // Get movieId from URL params

    const handleCreateEpisode = async (values: EpisodeFormValues) => {
        if (!movieId) {
            message.error(t('admin.message.movieIdMissing'));
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('number', String(values.number));
            formData.append('description', values.description);
            formData.append('movieId', movieId); // Append movieId from params
            if (thumbnailFile) {
                formData.append('thumbnail', thumbnailFile);
            }
            if (videoFile) {
                formData.append('link', videoFile);
            }

            const response = await postEpisode(formData);
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
            navigate(`${PREFIX_URL_ADMIN}/movies/${movieId}/episode`);
        } catch (error) {
            message.error(t('admin.message.fetchError'));
        } finally {
            setLoading(false);
        }
    };

    const handleThumbnailChange = ({ file }: { file: RcFile }) => {
        setThumbnailFile(file);
    };

    const handleVideoChange = ({ file }: { file: RcFile }) => {
        setVideoFile(file);
    };

    const handleResetForm = () => {
        form.resetFields();
        setThumbnailFile(null);
        setVideoFile(null);
    };

    return (
        <OutletTemplate
            breadcrumbItems={[
                { path: `${PREFIX_URL_ADMIN}/dashboard`, name: t('admin.dashboard.title') },
                { path: `${PREFIX_URL_ADMIN}/movies/${movieId}`, name: t('admin.movie.title') },
                { path: `${PREFIX_URL_ADMIN}/movies/${movieId}/episodes`, name: t('admin.episode.title') },
                { path: ``, name: t('admin.episode.create.title') },
            ]}
        >
            <Form
                form={form}
                onFinish={handleCreateEpisode}
                layout="vertical"
                className="create-episode-form"
            >
                <Form.Item
                    label={t('admin.episode.number')}
                    name="number"
                    rules={[{ required: true, message: t('admin.episode.create.validation.number') }]}
                >
                    <Input type="number" />
                </Form.Item>

                <Form.Item
                    label={t('admin.episode.description')}
                    name="description"
                    rules={[{ required: true, message: t('admin.episode.create.validation.description') }]}
                >
                    <Input.TextArea />
                </Form.Item>

                <Form.Item label={t('admin.episode.thumbnail')}>
                    <Upload
                        listType="picture-card"
                        beforeUpload={(file) => {
                            handleThumbnailChange({ file });
                            return false; // Prevent automatic upload
                        }}
                        showUploadList={false} // Hide the file list
                    >
                        {thumbnailFile ? (
                            <img
                                src={URL.createObjectURL(thumbnailFile as Blob)}
                                alt="thumbnail"
                                style={{ width: '100%' }}
                            />
                        ) : (
                            <div>
                                <UploadOutlined />
                                <div>{t('admin.episode.create.uploadThumbnail')}</div>
                            </div>
                        )}
                    </Upload>
                </Form.Item>

                <Form.Item label={t('admin.episode.link')}>
                    <Upload
                        beforeUpload={(file) => {
                            handleVideoChange({ file });
                            return false; // Prevent automatic upload
                        }}
                        showUploadList={false} // Hide the file list
                    >
                        <Button icon={<UploadOutlined />}>
                            {t('admin.episode.create.uploadVideo')}
                        </Button>
                    </Upload>
                    {videoFile && (
                        <video
                            controls
                            style={{ width: '100%', marginTop: '10px' }}
                            src={URL.createObjectURL(videoFile as Blob)}
                        >
                            Your browser does not support the video tag.
                        </video>
                    )}
                </Form.Item>

                <div className="form-actions">
                    <Button
                        htmlType="button"
                        onClick={handleResetForm}
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

export default CreateEpisode;