import React, { useEffect, useState } from 'react';
import { Button, Form, message, Upload, Input } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import OutletTemplate from '../../../templates/Outlet';
import { RcFile } from 'antd/es/upload';
import { EpisodeFormValues } from '../Create';
import { updateEpisodeById, getEpisodeById } from '../../../services/episodeService';
import './UpdateEpisode.scss';

const PREFIX_URL_ADMIN: string = import.meta.env.VITE_PREFIX_URL_ADMIN as string;

const UpdateEpisode: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [thumbnailFile, setThumbnailFile] = useState<RcFile | string | null>(null);
    const [videoFile, setVideoFile] = useState<RcFile | string | null>(null);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { id: episodeId, movieId } = useParams<{ id: string; movieId: string }>();

    // Fetch episode data when component mounts
    useEffect(() => {
        const fetchEpisode = async () => {
            if (!episodeId || !movieId) return;

            try {
                setLoading(true);
                const response = await getEpisodeById(episodeId);
                const result = await response.json();

                if (!response.ok || result.status !== 200) {
                    message.error(result.message || t('admin.message.fetchError'));
                    return;
                }

                form.setFieldsValue({
                    number: result.data.number,
                    description: result.data.description,
                });

                setThumbnailFile(result.data.thumbnail || null); // Set thumbnail
                setVideoFile(result.data.link || null); // Set video link
            } catch (error) {
                message.error(t('admin.message.fetchError'));
            } finally {
                setLoading(false);
            }
        };

        fetchEpisode();
    }, [episodeId, movieId, form, t]);

    const handleUpdateEpisode = async (values: EpisodeFormValues) => {
        if (!episodeId || !movieId) {
            message.error(t('admin.message.movieIdMissing'));
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('number', String(values.number));
            formData.append('description', values.description);
            formData.append('movieId', movieId); // Append movieId from params

            if (thumbnailFile && typeof thumbnailFile !== 'string') {
                formData.append('thumbnail', thumbnailFile); // Add thumbnail file
            }

            if (videoFile && typeof videoFile !== 'string') {
                formData.append('link', videoFile); // Add video file
            }

            const response = await updateEpisodeById(episodeId, formData);
            const result = await response.json();

            if (!response.ok || result.status !== 200) {
                message.error(result.message || t('admin.message.updateError'));
                return;
            }

            message.success(t('admin.message.updateSuccess'));
            navigate(`${PREFIX_URL_ADMIN}/movies/${movieId}/episodes`);
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
                { path: '', name: t('admin.episode.update.title') },
            ]}
        >
            <Form
                form={form}
                onFinish={handleUpdateEpisode}
                layout="vertical"
                className="update-episode-form"
            >
                <Form.Item
                    label={t('admin.episode.number')}
                    name="number"
                    rules={[{ required: true, message: t('admin.episode.update.validation.number') }]}
                >
                    <Input type="number" />
                </Form.Item>

                <Form.Item
                    label={t('admin.episode.description')}
                    name="description"
                    rules={[{ required: true, message: t('admin.episode.update.validation.description') }]}
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
                        showUploadList={false}
                    >
                        {thumbnailFile ? (
                            typeof thumbnailFile === 'string' ? (
                                <img src={thumbnailFile} alt="thumbnail" style={{ width: '100%' }} />
                            ) : (
                                <img
                                    src={URL.createObjectURL(thumbnailFile)}
                                    alt="thumbnail"
                                    style={{ width: '100%' }}
                                />
                            )
                        ) : (
                            <div>
                                <UploadOutlined />
                                <div>{t('admin.episode.update.uploadThumbnail')}</div>
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
                        showUploadList={false}
                    >
                        <Button icon={<UploadOutlined />}>
                            {t('admin.episode.create.uploadVideo')}
                        </Button>
                    </Upload>
                    {videoFile && (
                        typeof videoFile === 'string' ? (
                            <video controls style={{ width: '100%' }} src={videoFile}>
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <video controls style={{ width: '100%' }} src={URL.createObjectURL(videoFile)}>
                                Your browser does not support the video tag.
                            </video>
                        )
                    )}
                </Form.Item>

                <div className="form-actions">
                    <Button htmlType="button" onClick={handleResetForm} className="reset-button">
                        {t('admin.form.reset')}
                    </Button>
                    <Button type="primary" htmlType="submit" loading={loading} className="submit-button">
                        {t('admin.form.update')}
                    </Button>
                </div>
            </Form>
        </OutletTemplate>
    );
};

export default UpdateEpisode;