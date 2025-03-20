import React, {useEffect, useState} from 'react';
import {Button, Col, DatePicker, Form, Input, message, Row, Select, Upload} from 'antd';
import {useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import OutletTemplate from '../../../templates/Outlet';
import {postMovie} from "../../../services/movieService";
import './CreateMovie.scss';
import {RcFile} from "antd/es/upload";
import AddOptionModal from "../CreateDirector";
import {getDirectors} from "../../../services/directorService.tsx";
import {Director} from "../../Director";
import CountrySelect from "../../../components/CountrySelect";
import AvtEditor from "../../../components/AvtEditor";
import {UploadOutlined} from "@ant-design/icons";

const PREFIX_URL_ADMIN: string = import.meta.env.VITE_PREFIX_URL_ADMIN as string;

export interface MovieFormValues {
    title: string;
    description: string;
    trailer?: RcFile;
    nation: string;
    ranking: string;
    releaseDate: string;
    membershipType: string;
    director: string;
    thumbnail?: RcFile;
    coverImage?: RcFile;
}

export interface Country {
    name: {
        common: string;
        official: string;
    };
    cca3: string;
    flags: {
        png: string;
    }
}

const CreateMovie: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [thumbnail, setThumbnail] = useState<RcFile | null>(null);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [directorOptions, setDirectorOptions] = useState([]);
    const [trailer, setTrailer] = useState<RcFile | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
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

    const handleCreateMovie = async (values: MovieFormValues) => {
        // console.log(values);
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
            if (trailer) {
                formData.append('trailer', trailer);
            }

            const response = await postMovie(formData);
            const result = await response.json();
            if (!response.ok) {
                message.error(result.message || t('admin.message.createError'));
                return;
            }

            message.success(t('admin.message.createSuccess'));
            navigate(`${PREFIX_URL_ADMIN}/movies`);
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

    const handleThumbnailSave = (file: File | null) => {
        setThumbnail(file);
    };


    const handleResetForm = () => {
        form.resetFields();
        setThumbnail(null);
    };

    const handleAddOption = () => {
        setIsModalOpen(false);
    };

    const showAddOptionModal = () => {
        setIsModalOpen(true);
    };

    return (
        <OutletTemplate
            breadcrumbItems={[
                { path: `${PREFIX_URL_ADMIN}/dashboard`, name: t('admin.dashboard.title') },
                { path: `${PREFIX_URL_ADMIN}/movies`, name: t('admin.movie.title') },
                { path: ``, name: t('admin.movie.create.title') },
            ]}
        >
            <Form
                form={form}
                onFinish={handleCreateMovie}
                layout="vertical"
                className="create-movie-form"
            >
                <Row gutter={10}>
                    <Col span={14}>
                        <Form.Item
                            label={t('admin.movie.create.titleMovie')}
                            name="title"
                            rules={[{ required: true, message: t('admin.movie.validation.title') }]}
                        >
                            <Input placeholder={t('admin.movie.placeholder.title')}/>
                        </Form.Item>

                        <Form.Item
                            label={t('admin.movie.description')}
                            name="description"
                            rules={[{ required: true, message: t('admin.movie.validation.description') }]}
                        >
                            <Input.TextArea placeholder={t('admin.movie.placeholder.description')}/>
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

                            {/* Hiển thị video preview khi có file */}
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
                            <CountrySelect
                                placeholder={t('admin.form.selectNationality')}
                                onChange={(value) => form.setFieldsValue({ nationality: value })}
                                type='nationality'
                            />
                        </Form.Item>

                        <Form.Item
                            label={t('admin.movie.ranking')}
                            name="ranking"
                            rules={[{ required: true, message: t('admin.movie.validation.ranking') }]}
                        >
                            <Input placeholder={t('admin.movie.placeholder.ranking')}/>
                        </Form.Item>

                        <Form.Item
                            label={t('admin.movie.releaseDate')}
                            name="releaseDate"
                            rules={[{ required: true, message: t('admin.movie.validation.releaseDate') }]}
                        >
                            <DatePicker
                                format="YYYY-MM-DD"
                                onChange={(_date, dateString) => {
                                    form.setFieldsValue({ dateOfBirth: dateString });
                                }}
                            />
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
                                placeholder="Chọn đạo diễn"
                                dropdownRender={(menu) => (
                                    <>
                                        {menu}
                                        <div>
                                            <Button type="link" onClick={() => showAddOptionModal()}>
                                                + Thêm mới đạo diễn
                                            </Button>
                                        </div>
                                    </>
                                )}
                            >
                                {directorOptions.map((director: Director) => (
                                    <Select.Option key={director.id} value={director.fullName}>
                                        {director.fullName}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={10} className="thumbnail-col">
                        <Form.Item label={t('admin.movie.thumbnail')} className="thumbnail-wrapper">
                            <AvtEditor
                                onSave={handleThumbnailSave}
                                initialImage={
                                    thumbnail
                                        ? URL.createObjectURL(thumbnail)
                                        : '/assets/images/background-default.jpg'
                                }
                                shape="rectangle"
                            />
                        </Form.Item>

                        <Form.Item label={t('admin.movie.coverImage')} className="thumbnail-wrapper">
                            <AvtEditor
                                onSave={handleThumbnailSave}
                                initialImage={
                                    thumbnail
                                        ? URL.createObjectURL(thumbnail)
                                        : '/assets/images/background-default.jpg'
                                }
                                shape="rectangle"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <div className="form-actions">
                    <Button onClick={handleResetForm} className="reset-button">
                        {t('admin.form.reset')}
                    </Button>
                    <Button type="primary" htmlType="submit" loading={loading} className="submit-button">
                        {t('admin.form.create')}
                    </Button>
                </div>
            </Form>
            <AddOptionModal
                visible={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onAdd={handleAddOption}
            />
        </OutletTemplate>

    );
};

export default CreateMovie;
