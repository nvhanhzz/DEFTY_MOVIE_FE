import React, {useEffect, useState} from 'react';
import {Button, Col, DatePicker, Form, Input, message, Row, Select, Upload} from 'antd';
import {useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import OutletTemplate from '../../../templates/Outlet';
import {getMovieById, updateMovieById} from "../../../services/movieService";
import './UpdateMovie.scss';
import {RcFile} from "antd/es/upload";
import {Country, MovieFormValues} from "../Create";
import {Movie} from "../index.tsx";
import dayjs from 'dayjs';
import {getDirectors} from "../../../services/directorService.tsx";
import {UploadOutlined} from "@ant-design/icons";

const PREFIX_URL_ADMIN: string = import.meta.env.VITE_PREFIX_URL_ADMIN as string;

const UpdateMovie: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);
    const [thumbnail, setThumbnail] = useState<RcFile | null>(null);
    const [coverImage, setCoverImage] = useState<RcFile | null>(null);
    const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
    const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const [directorOptions, setDirectorOptions] = useState([]);
    const [nation, setNation] = useState([]);
    const [trailer, setTrailer] = useState<RcFile | null>(null);
    const [trailerPreview, setTrailerPreview] = useState<string | null>(null);

    useEffect(() => {
        const fetchDirectors = async () => {
            try {
                const response = await getDirectors(1, 999999999);
                const data = await response.json()
                // console.log(data.data.content)
                if (response.ok) {
                    setDirectorOptions(data.data.content);
                } else {
                    message.error('Failed to load roles');
                }
            } catch (error) {
                message.error('Error fetching directors');
                console.error(error);
            }
        };
        fetchDirectors();
    }, []);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const response = await getMovieById(id as string);
                const result = await response.json();
                if (response.ok && result.status === 200) {
                    const data: Movie = result.data;
                    form.setFieldsValue({
                        title: data.title,
                        description: data.description,
                        trailer: data.trailer,
                        nation: data.nation,
                        ranking: data.ranking,
                        releaseDate: data.releaseDate ? dayjs(data.releaseDate) : null,
                        membershipType: data.membershipType,
                        director: data.director,
                    });
                    if (data.thumbnail) {
                        setThumbnailUrl(data.thumbnail);
                    }
                    if (data.coverImage) {
                        setCoverImageUrl(data.coverImage);
                    }
                    if (data.trailer) {
                        setTrailer(data.trailer);
                    }
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                message.error('Error fetching movie data');
            }
        };
        fetchMovie();
    }, [id, form]);


    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await fetch('https://restcountries.com/v3.1/all');
                const data = await response.json();

                const countries = data.sort((a: { name: { common: string; }; }, b: { name: { common: never; }; }) =>
                    a.name.common.localeCompare(b.name.common)
                );

                setNation(countries);
            } catch (error) {
                console.error('Error fetching countries:', error);
            }
        };
        fetchCountries();
    }, []);

    const handleUpdateMovie = async (values: MovieFormValues) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('description', values.description);
            // formData.append('trailer', values.trailer);
            formData.append('nation', values.nation);
            formData.append('ranking', values.ranking);
            formData.append('releaseDate', values.releaseDate);
            formData.append('membershipType', values.membershipType);
            formData.append('director', values.director);
            if (thumbnail) {
                formData.append('thumbnail', thumbnail);
            }
            if (coverImage) {
                formData.append('coverImage', coverImage);
            }
            if (trailer) {
                formData.append('trailer', trailer);
            }

            const response = await updateMovieById(id as string, formData);
            const result = await response.json();
            if (!response.ok) {
                message.error(result.message || t('admin.message.updateError'));
                return;
            }
            if (result.status !== 200) {
                message.error(result.message || t('admin.message.updateError'));
                return;
            }

            message.success(t('admin.message.updateSuccess'));
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            message.error(t('admin.message.fetchError'));
        } finally {
            setLoading(false);
        }
    };

    const handleTrailerSave = (file: File) => {
        const videoURL = URL.createObjectURL(file);
        setTrailer(file);
        setTrailerPreview(videoURL);
    };

    const handleImageUpload = (file: RcFile, type: "thumbnail" | "coverImage") => {
        const previewUrl = URL.createObjectURL(file);
        if (type === "thumbnail") {
            setThumbnail(file);
            setThumbnailUrl(previewUrl);
        } else {
            setCoverImage(file);
            setCoverImageUrl(previewUrl);
        }
        return false;
    };

    const handleResetForm = () => {
        form.resetFields();
        setThumbnail(null);
        setCoverImage(null);
    };

    return (
        <OutletTemplate
            breadcrumbItems={[
                { path: `${PREFIX_URL_ADMIN}/dashboard`, name: t('admin.dashboard.title') },
                { path: `${PREFIX_URL_ADMIN}/movies`, name: t('admin.movie.title') },
                { path: ``, name: t('admin.movie.update.title') },
            ]}
        >
            <Form
                form={form}
                onFinish={handleUpdateMovie}
                layout="vertical"
                className="update-movie-form"
            >
                <Row gutter={10}>
                    <Col span={14}>
                        <Form.Item
                            label={t('admin.movie.create.titleMovie')}
                            name="title"
                            rules={[{ required: true, message: t('admin.movie.validation.title') }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label={t('admin.movie.description')}
                            name="description"
                            rules={[{ required: true, message: t('admin.movie.validation.description') }]}
                        >
                            <Input.TextArea />
                        </Form.Item>

                        <Form.Item
                            label="Trailer"
                            name="trailer"
                            rules={[{ required: true, message: "Vui lòng tải lên trailer!" }]}
                        >
                            <Upload
                                beforeUpload={(file) => {
                                    handleTrailerSave(file);
                                    return false;
                                }}
                                accept="video/*"
                                maxCount={1}
                            >
                                <Button icon={<UploadOutlined />}>Upload Trailer</Button>
                            </Upload>

                            {trailerPreview && (
                                <div style={{ marginTop: 10 }}>
                                    <video width="100%" controls>
                                        <source src={trailerPreview} type="video/mp4" />
                                        Trình duyệt của bạn không hỗ trợ video.
                                    </video>
                                </div>
                            )}
                        </Form.Item>

                        <Form.Item
                            label={t('admin.movie.nation')}
                            name="nation"
                            rules={[{ required: true, message: t('admin.movie.validation.nation') }]}
                        >
                            <Select
                                placeholder="Chọn quốc gia"
                                showSearch
                                style={{ width: 200 }}
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={nation.map((country: Country) => ({
                                    label: country.name.common,
                                    value: country.name.common,
                                }))}
                            />
                        </Form.Item>

                        <Form.Item
                            label={t('admin.movie.ranking')}
                            name="ranking"
                            rules={[{ required: true, message: t('admin.movie.validation.ranking') }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label={t('admin.movie.releaseDate')}
                            name="releaseDate"
                            rules={[{ required: true, message: t('admin.movie.validation.releaseDate') }]}
                        >
                            <DatePicker
                                format="YYYY-MM-DD"
                            />
                        </Form.Item>

                        <Form.Item name="dateOfBirth" style={{ display: 'none' }}>
                            <Input type="hidden" />
                        </Form.Item>

                        <Form.Item
                            label={t('admin.movie.membershipType')}
                            name="membershipType"
                            rules={[{ required: true, message: t('admin.movie.validation.membershipType') }]}
                        >
                            <Select
                                placeholder={t('admin.movie.membershipTypePlaceholder')}
                                options={[
                                    { label: 'VIP', value: 1 },
                                    { label: 'Normal', value: 0 }
                                ]}
                            />
                        </Form.Item>

                        <Form.Item
                            label={t('admin.movie.director')}
                            name="director"
                            rules={[{ required: true, message: t('admin.movie.validation.director') }]}
                        >
                            <Select placeholder={t('admin.movie.directorPlaceholder')}>
                                {directorOptions.map((director: { fullName: string; id: string }) => (
                                    <Select.Option key={director.id} value={director.fullName}>
                                        {director.fullName}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                    </Col>

                    <Col span={10} className="thumbnail-col">
                        <Form.Item label={t('admin.movie.thumbnail')}>
                            <Upload
                                beforeUpload={(file) => handleImageUpload(file, "thumbnail")}
                                accept="image/*"
                                showUploadList={false}
                            >
                                <Button icon={<UploadOutlined />}>Upload Thumbnail</Button>
                            </Upload>
                            {thumbnailUrl && (
                                <img
                                    src={thumbnailUrl}
                                    alt="Thumbnail preview"
                                    style={{
                                        marginTop: 10,
                                        width: '350px',
                                        height: '220px',
                                        objectFit: 'cover',
                                        borderRadius: '5px',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                                    }}
                                />
                            )}
                        </Form.Item>

                        <Form.Item label={t('admin.movie.coverImage')}>
                            <Upload
                                beforeUpload={(file) => handleImageUpload(file, "coverImage")}
                                accept="image/*"
                                showUploadList={false}
                            >
                                <Button icon={<UploadOutlined />}>Upload Cover Image</Button>
                            </Upload>
                            {coverImageUrl && (
                                <img
                                    src={coverImageUrl}
                                    alt="Cover Image preview"
                                    style={{
                                        marginTop: 10,
                                        width: '350px',
                                        height: '220px',
                                        objectFit: 'cover',
                                        borderRadius: '5px',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                                    }}
                                />
                            )}
                        </Form.Item>


                    </Col>

                </Row>
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
                        {t('admin.form.update')}
                    </Button>
                </div>
            </Form>
        </OutletTemplate>
    );
};

export default UpdateMovie;
