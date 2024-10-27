import React, { useState } from 'react';
import { Form, Input, Button, Typography } from 'antd';
import './LoginPage.scss';
import { useAdminDispatch } from '../../hooks/useAdminDispatch';
import { setCurrentAccount } from '../../redux/actions/account';
import { addAlert } from '../../redux/actions/alert';
import { postLogin } from '../../services/authService';
import { setCurrentAccountHelper } from '../../helpers/Account';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;

const Login: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useAdminDispatch();
    const [loading, setLoading] = useState<boolean>(false);

    const onFinish = async (values: { username: string; password: string }): Promise<void> => {
        setLoading(true); // Bắt đầu loading khi đăng nhập
        const response = await postLogin(values);

        const result = await response.json();
        if (!response.ok || result.status !== 200) {
            dispatch(addAlert(t('admin.login.errorTitle'), t('admin.login.errorMessage'), 5)); // Thông báo khi lỗi
            setLoading(false); // Dừng loading khi có lỗi
            return;
        }

        try {
            const account = await setCurrentAccountHelper();
            dispatch(setCurrentAccount(account));
            dispatch(addAlert(t('admin.login.successTitle'), t('admin.login.successMessage'), 5)); // Thông báo khi đăng nhập thành công
        } catch (error) {
            console.error("Error checking logged in status:", error);
            dispatch(setCurrentAccount(null));
        } finally {
            setLoading(false); // Dừng loading sau khi xử lý
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <Title level={2} className="login-title">
                    {t('admin.login.title')}
                </Title>
                <Form
                    name="login"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    className="login-form"
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: t('admin.login.usernameRequired') }]}
                    >
                        <Input placeholder={t('admin.login.usernamePlaceholder')} />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: t('admin.login.passwordRequired') }]}
                    >
                        <Input.Password placeholder={t('admin.login.passwordPlaceholder')} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button" loading={loading}>
                            {t('admin.login.buttonName')}
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Login;