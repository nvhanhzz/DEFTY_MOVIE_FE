import React, {useState} from 'react'; // Import useRef
import {Button, Form, Input, message, Upload} from 'antd';
import {useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {postArticle} from '../../../services/articleService';
import OutletTemplate from '../../../templates/Outlet';
import {RcFile} from 'antd/es/upload'; // Import RcFile
import './CreateArticle.scss';
import {UploadOutlined} from "@ant-design/icons";

const PREFIX_URL_ADMIN: string = import.meta.env.VITE_PREFIX_URL_ADMIN as string;

export interface ArticleFormValues {
    title: string;
    content: string;
    author: string;
    thumbnail?: RcFile;  // Use RcFile for thumbnail as well
}

const CreateArticle: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<RcFile | null>(null);  // Use RcFile type for the file
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { t } = useTranslation();

    // Handle form submission
    const handleCreateArticle = async (values: ArticleFormValues) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('content', values.content);
            formData.append('author', values.author);

            if (file) {
                formData.append('thumbnail', file);  // Append file as thumbnail
            }

            const response = await postArticle(formData);
            const result = await response.json();
            console.log(response, result);
            if (!response.ok) {
                message.error(result.message || t('admin.message.createError'));
                return;
            }
            if (result.status !== 200) {
                message.error(result.message || t('admin.message.createError'));
                return;
            }

            message.success(t('admin.message.createSuccess'));
            navigate(`${PREFIX_URL_ADMIN}/articles`);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            message.error(t('admin.message.fetchError'));
        } finally {
            setLoading(false);
        }
    };

    // Handle file change (thumbnail)
    const handleThumbnailChange = ({ file }: { file: RcFile }) => {
        setFile(file);
    };

    // Handle form reset
    const handleResetForm = () => {
        form.resetFields();
        setFile(null);
    };

    return (
        <OutletTemplate
            breadcrumbItems={[
                { path: `${PREFIX_URL_ADMIN}/dashboard`, name: t('admin.dashboard.title') },
                { path: `${PREFIX_URL_ADMIN}/articles`, name: t('admin.article.title') },
                { path: '', name: t('admin.article.create.title') },
            ]}
        >
            <Form
                form={form}
                onFinish={handleCreateArticle}
                layout="vertical"
                className="create-article-form"
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
                    rules={[{ required: true, message: t('admin.article.validation.title') }]}
                >
                    <Input />
                </Form.Item>

                {/*<Form.Item*/}
                {/*    label={t('admin.article.content')}*/}
                {/*    name="content"*/}
                {/*>*/}
                {/*    <Editor*/}
                {/*        initialValue=""*/}
                {/*        init={tinyMceConfig}*/}
                {/*        onEditorChange={(content, editor) => {*/}
                {/*            form.setFieldsValue({ content: content });*/}
                {/*        }}*/}
                {/*    />*/}
                {/*</Form.Item>*/}

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
                            <img
                                src={file ? URL.createObjectURL(file as Blob) : 'https://via.placeholder.com/150'}
                                alt="thubnail"
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
                        {t('admin.form.create')}
                    </Button>
                </div>
            </Form>
        </OutletTemplate>
    );
};

export default CreateArticle;