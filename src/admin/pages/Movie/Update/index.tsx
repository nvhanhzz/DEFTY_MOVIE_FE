import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message, Upload, DatePicker, Select, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import OutletTemplate from '../../../templates/Outlet';
import { getMovieById, updateMovieById } from "../../../services/movieService";
import './UpdateMovie.scss';
import { RcFile } from "antd/es/upload";
import { MovieFormValues } from "../Create";
import { Movie } from "../index.tsx";
import dayjs from 'dayjs';
import {getDirectors} from "../../../services/directorService.tsx";

const PREFIX_URL_ADMIN: string = import.meta.env.VITE_PREFIX_URL_ADMIN as string;

const UpdateMovie: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);
    const [thumbnail, setThumbnail] = useState<RcFile | null>(null);
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const [directorOptions, setDirectorOptions] = useState([]);
    const [nation, setNation] = useState([]);

    useEffect(() => {
        const fetchDirectors = async () => {
            try {
                const response = await getDirectors(1, 999999999);
                const data = await response.json();
                if (response.ok) {
                    const options = data.data.content.map((director: { fullName: never; }) => ({
                        label: director.fullName,
                        value: director.fullName,
                    }));
                    setDirectorOptions(options);
                } else {
                    message.error('Failed to load directors');
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
                    console.log(data)
                    form.setFieldsValue({
                        title: data.title,
                        description: data.description,
                        trailer: data.trailer,
                        nation: data.nation,
                        ranking: data.ranking,
                        // releaseDate: data.releaseDate,
                        membershipType: data.membershipType,
                        director: data.director,
                        releaseDate: data.releaseDate ? dayjs(data.releaseDate) : null,
                    });
                    if (data.thumbnail) {
                        form.setFieldsValue({ thumbnail: data.thumbnail });
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
                if (!response.ok) {
                    throw new Error('Failed to fetch countries');
                }
                const data = await response.json();
                const countries = data
                    .map((country: { name: { common: string }; cca2: string }) => ({
                        label: country.name.common,
                        value: country.name.common,
                    }))
                    .sort((a: { label: string; }, b: { label: never; }) => a.label.localeCompare(b.label));
                setNation(countries);
            } catch (error) {
                message.error('Error fetching countries');
                console.error(error);
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
            formData.append('trailer', values.trailer);
            formData.append('nation', values.nation);
            formData.append('ranking', values.ranking);
            formData.append('releaseDate', values.releaseDate);
            formData.append('membershipType', values.membershipType);
            formData.append('director', values.director);
            if (thumbnail) {
                formData.append('thumbnail', thumbnail);
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

    // Hàm xử lý khi chọn thumbnail
    const handleAvatarChange = ({ file }: { file: RcFile }) => {
        console.log(file)
        setThumbnail(file);
    };

    // Hàm xử lý khi reset form, bao gồm reset thumbnail
    const handleResetForm = () => {
        form.resetFields();
        setThumbnail(null);
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
                    <Col span={16}>
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
                            label={t('admin.movie.trailer')}
                            name="trailer"
                            rules={[{ required: true, message: t('admin.movie.validation.trailer') }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label={t('admin.movie.nation')}
                            name="nation"
                            rules={[{ required: true, message: t('admin.movie.validation.nation') }]}
                        >
                            <Select
                                options={nation}
                                placeholder={t('admin.movie.placeholder.nation')}
                                showSearch
                                filterOption={(input, option) =>
                                    option.label.toLowerCase().includes(input.toLowerCase())
                                }
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
                            <Select
                                placeholder={t('admin.movie.directorPlaceholder')}
                                options={directorOptions}
                            />
                        </Form.Item>

                    </Col>

                    <Col span={8} className="thumbnail-col">
                        <Form.Item label={t('admin.movie.thumbnail')} className="thumbnail-wrapper">
                            <div className="thumbnail-preview">
                                <Upload
                                    listType="picture-card"
                                    beforeUpload={(file) => {
                                        handleAvatarChange({ file });
                                        return false;
                                    }}
                                    showUploadList={false}
                                    className="thumbnail-uploader"
                                >
                                    <div className={"thumbnail-upload"}>
                                        {thumbnail ? (
                                            <img
                                                src={URL.createObjectURL(thumbnail)}
                                                alt="thumbnail"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <UploadOutlined style={{ fontSize: '24px' }} />
                                        )}
                                    </div>
                                </Upload>
                                <Button className="upload-button">
                                    <UploadOutlined /> {t('admin.movie.upload')}
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
                        {t('admin.form.update')}
                    </Button>
                </div>
            </Form>
        </OutletTemplate>
    );
};

export default UpdateMovie;
