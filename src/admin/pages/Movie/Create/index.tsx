import React, {useEffect, useState} from 'react';
import { Button, Form, Input, message, Upload, DatePicker, Select, Row, Col} from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import OutletTemplate from '../../../templates/Outlet';
import { postMovie } from "../../../services/movieService";
import './CreateMovie.scss';
import { RcFile } from "antd/es/upload";
import AddOptionModal from "../CreateDirector";
import { UploadOutlined } from "@ant-design/icons";
import {getDirectors} from "../../../services/directorService.tsx";

const PREFIX_URL_ADMIN: string = import.meta.env.VITE_PREFIX_URL_ADMIN as string;

export interface MovieFormValues {
    title: string;
    description: string;
    trailer: string;
    nation: string;
    ranking: string;
    releaseDate: string;
    membershipType: string;
    director: string;
    thumbnail?: RcFile;
    coverImage?: RcFile;
}

const CreateMovie: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [thumbnail, setThumbnail] = useState<RcFile | null>(null);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [directorOptions, setDirectorOptions] = useState([]);
    const [nation, setNation] = useState([]);
    const [currentField, setCurrentField] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state for director

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
                    console.log(options);
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


    const handleCreateMovie = async (values: MovieFormValues) => {
        console.log(values);
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

    const handleAvatarChange = ({ file }: { file: RcFile }) => {
        setThumbnail(file);
    };

    const handleResetForm = () => {
        form.resetFields();
        setThumbnail(null);
    };

    const handleAddOption = () => {
        // if (currentField === "membershipType") {
        //     setMembershipOptions([...membershipOptions, { value: newOption, label: newOption }]);
        // } else if (currentField === "director") {
        //     setDirectorOptions([...directorOptions, { value: newOption, label: newOption }]);
        // }
        setIsModalOpen(false);
    };

    const showAddOptionModal = (field: string) => {
        setCurrentField(field);
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
                    <Col span={16}>
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
                            label={t('admin.movie.trailer')}
                            name="trailer"
                            rules={[{ required: true, message: t('admin.movie.validation.trailer') }]}
                        >
                            <Input placeholder={t('admin.movie.placeholder.trailer')}/>
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
                                options={directorOptions}
                                placeholder={t('admin.movie.directorPlaceholder')}
                                dropdownRender={(menu) => (
                                    <>
                                        {menu}
                                        <Button type="link" onClick={() => showAddOptionModal("director")}>
                                            + {t('admin.movie.addNewOption')}
                                        </Button>
                                    </>
                                )}
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
