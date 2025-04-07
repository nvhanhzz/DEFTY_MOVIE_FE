import React, {useEffect, useState} from 'react';
import {Button, Col, DatePicker, Form, Input, message, Row, Select, Upload} from 'antd';
import {useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import OutletTemplate from '../../../templates/Outlet';
import {getMovieById, updateMovieById} from "../../../services/movieService";
import './UpdateMovie.scss';
import {RcFile} from "antd/es/upload";
import {Country, MovieFormValues} from "../Create";
import { MembershipPackage} from "../../MembershipPackage";
import {Movie} from "../index.tsx";
import dayjs from 'dayjs';
import {getDirectors} from "../../../services/directorService.tsx";
import {UploadOutlined} from "@ant-design/icons";
import {getMembershipPackets} from "../../../services/membershipPackageService.tsx";

const PREFIX_URL_ADMIN: string = import.meta.env.VITE_PREFIX_URL_ADMIN as string;
const DEFAULT_IMAGE_URL = 'https://res.cloudinary.com/drsmkfjfo/image/upload/v1743092499/b6924968-f4d3-49f6-9165-8237402ba096_background-default.jpg';


const UpdateMovie: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
    const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const [directorOptions, setDirectorOptions] = useState([]);
    const [nation, setNation] = useState([]);
    const [trailer, setTrailer] = useState<RcFile | null>(null);
    const [trailerPreview, setTrailerPreview] = useState<string | null>(null);
    const [membership, setMembership] = useState<MembershipPackage[]>([]);

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
        const fetchMembership = async () => {
            try {
                const response = await getMembershipPackets(1, 999999999);
                const data = await response.json();
                if (response.ok) {
                    setMembership(data.data.content);
                    // console.log(data.data.content);
                } else {
                    message.error('Failed to load membership');
                }
            } catch (error) {
                message.error('Error fetching membership');
                console.error(error);
            }
        };
        fetchMembership();
    }, []);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const response = await getMovieById(id as string);
                const result = await response.json();
                if (response.ok && result.status === 200) {
                    const data: Movie = result.data;
                    // Tìm directorId từ directorOptions dựa trên tên director
                    const selectedDirector = directorOptions.find(
                        (dir: { fullName: string; id: string }) => dir.fullName === data.director
                    );
                    const directorId = selectedDirector ? selectedDirector.id : undefined;

                    form.setFieldsValue({
                        title: data.title,
                        description: data.description,
                        trailer: data.trailer,
                        nation: data.nation,
                        ranking: data.ranking,
                        releaseDate: data.releaseDate ? dayjs(data.releaseDate) : null,
                        membershipType: data.membershipType,
                        directorId: directorId,
                    });
                    if (data.thumbnail) {
                        setThumbnailUrl(data.thumbnail);
                    }
                    if (data.coverImage) {
                        setCoverImageUrl(data.coverImage);
                    }
                    if (data.trailer) {
                        setTrailerPreview(data.trailer);
                    }
                }
            } catch (error) {
                message.error('Error fetching movie data');
                console.error(error);
            }
        };
        fetchMovie();
    }, [id, form, directorOptions]); // Thêm directorOptions vào dependency


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
            formData.append('nation', values.nation);
            formData.append('ranking', values.ranking);
            formData.append('releaseDate', values.releaseDate);
            formData.append('membershipType', values.membershipType);
            formData.append('directorId', String(values.directorId));
            if (thumbnail) {
                formData.append('thumbnail', thumbnail);
            }
            if (coverImage) {
                formData.append('coverImage', coverImage);
            }
            if (trailer) {
                formData.append('trailer', trailer);
            }
            console.log('FormData:', [...formData.entries()]);
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

    const handleTrailerSave = (file: RcFile) => {
        const isVideo = file.type.startsWith('video/');
        const isLt100M = file.size / 1024 / 1024 < 100; // Giới hạn 100MB

        if (!isVideo) {
            message.error('Vui lòng upload file video!');
            return false;
        }
        if (!isLt100M) {
            message.error('File video phải nhỏ hơn 100MB!');
            return false;
        }

        const videoURL = URL.createObjectURL(file);
        setTrailer(file);
        setTrailerPreview(videoURL);
        return false;
    };

    const handleThumbnailChange = (info: any) => {
        const file = info.file.originFileObj as File;
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setThumbnail(file);
            setThumbnailUrl(previewUrl);
        }
    };

    const handleCoverImageChange = (info: any) => {
        const file = info.file.originFileObj as File;
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setCoverImage(file);
            setCoverImageUrl(previewUrl);
        }
    };

    const handleResetForm = () => {
        form.resetFields();
        setThumbnail(null);
        setCoverImage(null);
    };

    const handleRemoveTrailer = () => {
        setTrailer(null);
        setTrailerPreview(null);
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
                            <Input.TextArea autoSize={{ minRows: 3, maxRows: 100 }} />
                        </Form.Item>

                        <Form.Item
                            label="Trailer"
                            name="trailer"
                            // rules={[{ required: true, message: "Vui lòng tải lên trailer!" }]} // Bỏ required nếu không bắt buộc
                        >
                            <Upload
                                beforeUpload={handleTrailerSave}
                                accept="video/*"
                                maxCount={1}
                                fileList={[]}
                                showUploadList={{ showRemoveIcon: true }}
                                onRemove={handleRemoveTrailer}
                            >
                                <Button icon={<UploadOutlined />}>Upload Trailer</Button>
                            </Upload>
                            {trailerPreview && (
                                <div style={{ marginTop: 10 }}>
                                    <video width="100%" controls key={trailerPreview}>
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
                            >
                                {[...new Map(membership.map((m) => [m.membershipType, m])).values()].map((membership) => (
                                    <Select.Option key={membership.id} value={membership.membershipType}>
                                        {membership.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label={t('admin.movie.director')}
                            name="directorId"
                            rules={[{ required: true, message: t('admin.movie.validation.director') }]}
                        >
                            <Select placeholder={t('admin.movie.directorPlaceholder')}>
                                {directorOptions.map((director: { fullName: string; id: string }) => (
                                    <Select.Option key={director.id} value={director.id}>
                                        {director.fullName}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                    </Col>

                    <Col span={10} className="thumbnail-col">
                        <Form.Item label={t('admin.movie.thumbnail')}>
                            <Upload
                                onChange={handleThumbnailChange}
                                accept="image/*"
                                showUploadList={false}
                            >
                                <Button icon={<UploadOutlined />}>Upload Thumbnail</Button>
                            </Upload>
                            {thumbnailUrl ? (
                                <img
                                    src={thumbnailUrl}
                                    alt="Thumbnail"
                                    style={{ width: 300, height: 200, objectFit: 'cover', marginTop: 10, borderRadius: 5 }}
                                />
                            ) : (
                                <img
                                    src={DEFAULT_IMAGE_URL}
                                    alt="Default Thumbnail"
                                    style={{ width: 300, height: 200, objectFit: 'cover', marginTop: 10, borderRadius: 5 }}
                                />
                            )}
                        </Form.Item>

                        <Form.Item label={t('admin.movie.coverImage')}>
                            <Upload
                                onChange={handleCoverImageChange}
                                accept="image/*"
                                showUploadList={false}
                            >
                                <Button icon={<UploadOutlined />}>Upload Cover Image</Button>
                            </Upload>
                            {coverImageUrl ? (
                                <img
                                    src={coverImageUrl}
                                    alt="Cover Image"
                                    style={{ width: 300, height: 200, objectFit: 'cover', marginTop: 10, borderRadius: 5 }}
                                />
                            ) : (
                                <img
                                    src={DEFAULT_IMAGE_URL}
                                    alt="Default Thumbnail"
                                    style={{ width: 300, height: 200, objectFit: 'cover', marginTop: 10, borderRadius: 5 }}
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
