import React, { useEffect, useState } from 'react';
import { Button, Col, DatePicker, Form, Input, message, Row, Select, Upload } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import OutletTemplate from '../../../templates/Outlet';
import { postMovie } from '../../../services/movieService';
import './CreateMovie.scss';
import { RcFile } from 'antd/es/upload';
import AddOptionModal from '../CreateDirector';
import { getDirectors } from '../../../services/directorService.tsx';
import { Director } from '../../Director';
import { MembershipPackage} from "../../MembershipPackage";
import CountrySelect from '../../../components/CountrySelect';
import { UploadOutlined } from '@ant-design/icons';
import {getMembershipPackets} from "../../../services/membershipPackageService.tsx";
const PREFIX_URL_ADMIN: string = import.meta.env.VITE_PREFIX_URL_ADMIN as string;
const DEFAULT_IMAGE_URL = 'https://res.cloudinary.com/drsmkfjfo/image/upload/v1743092499/b6924968-f4d3-49f6-9165-8237402ba096_background-default.jpg';

export interface MovieFormValues {
    title: string;
    description: string;
    trailer?: RcFile;
    nation: string;
    ranking: string;
    releaseDate: string;
    membershipType: string;
    directorId: number;
    director: string;
    thumbnail?: RcFile;
    coverImage?: RcFile;
}

const CreateMovie: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [thumbnail, setThumbnail] = useState<RcFile | null>(null);
    const [coverImage, setCoverImage] = useState<RcFile | null>(null);
    const [trailer, setTrailer] = useState<RcFile | null>(null);
    const [trailerPreview, setTrailerPreview] = useState<string | null>(null);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [directorOptions, setDirectorOptions] = useState<Director[]>([]);
    const [membership, setMembership] = useState<MembershipPackage[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchDirectors = async () => {
            try {
                const response = await getDirectors(1, 999999999);
                const data = await response.json();
                if (response.ok) {
                    setDirectorOptions(data.data.content);
                    // console.log(data.data.content);
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

    const handleCreateMovie = async (values: MovieFormValues) => {
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

            const response = await postMovie(formData);
            const result = await response.json();
            if (!response.ok || result.status !== 201) {
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

    const handleTrailerSave = (file: RcFile) => {
        const videoURL = URL.createObjectURL(file);
        console.log(videoURL)
        setTrailer(file);
        setTrailerPreview(videoURL);
    };

    const handleThumbnailChange = ({ fileList }: { fileList: any[] }) => {
        if (fileList.length > 0) {
            setThumbnail(fileList[0].originFileObj as RcFile);
        } else {
            setThumbnail(null);
        }
    };

    const handleCoverImageChange = ({ fileList }: { fileList: any[] }) => {
        if (fileList.length > 0) {
            setCoverImage(fileList[0].originFileObj as RcFile);
        } else {
            setCoverImage(null);
        }
    };

    const handleResetForm = () => {
        form.resetFields();
        setThumbnail(null);
        setCoverImage(null);
        setTrailer(null);
        setTrailerPreview(null);
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
                { path: '', name: t('admin.movie.create.title') },
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
                            <Input placeholder={t('admin.movie.placeholder.title')} />
                        </Form.Item>

                        <Form.Item
                            label={t('admin.movie.description')}
                            name="description"
                            rules={[{ required: true, message: t('admin.movie.validation.description') }]}
                        >
                            <Input.TextArea placeholder={t('admin.movie.placeholder.description')}
                                            autoSize={{ minRows: 3, maxRows: 100 }}/>
                        </Form.Item>

                        <Form.Item label="Trailer" name="trailer">
                            <Upload
                                beforeUpload={(file) => {
                                    handleTrailerSave(file);
                                    return false;
                                }}
                                accept="video/*"
                                maxCount={1}
                                fileList={[]}
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
                            <CountrySelect
                                placeholder={t('admin.form.selectNationality')}
                                onChange={(value) => form.setFieldsValue({ nation: value })}
                                type="nationality"
                            />
                        </Form.Item>

                        <Form.Item
                            label={t('admin.movie.ranking')}
                            name="ranking"
                            rules={[{ required: true, message: t('admin.movie.validation.ranking') }]}
                        >
                            <Input placeholder={t('admin.movie.placeholder.ranking')} />
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
                            <Select
                                placeholder="Chọn đạo diễn"
                                dropdownRender={(menu) => (
                                    <>
                                        {menu}
                                        <div>
                                            <Button type="link" onClick={showAddOptionModal}>
                                                + Thêm mới đạo diễn
                                            </Button>
                                        </div>
                                    </>
                                )}
                            >
                                {directorOptions.map((director) => (
                                    <Select.Option key={director.id} value={director.id}>
                                        {director.fullName}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={8} className="thumbnail-col">
                        <Form.Item label="Thumbnail"
                                   name="thumbnail">
                            <Upload
                                beforeUpload={() => false}
                                onChange={handleThumbnailChange}
                                maxCount={1}
                                fileList={[]}
                            >
                                <Button icon={<UploadOutlined />}>Upload Thumbnail</Button>
                            </Upload>
                            {thumbnail ? (
                                <img
                                    src={URL.createObjectURL(thumbnail)}
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

                        <Form.Item label="Cover Image"
                                   name="coverImage">
                            <Upload
                                beforeUpload={() => false}
                                onChange={handleCoverImageChange}
                                maxCount={1}
                                fileList={[]}
                            >
                                <Button icon={<UploadOutlined />}>Upload Cover Image</Button>
                            </Upload>
                            {coverImage ? (
                                <img
                                    src={URL.createObjectURL(coverImage)}
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