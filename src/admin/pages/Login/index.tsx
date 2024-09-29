import React from 'react';
import { Form, Input, Button, Typography } from 'antd';
import './LoginPage.scss';
import { useAdminDispatch } from '../../hooks/useAdminDispatch';
import { setCurrentAccount } from '../../redux/actions/account';
import { addAlert } from '../../redux/actions/alert';

const { Title } = Typography;

const Login: React.FC = () => {
    const dispatch = useAdminDispatch();

    const onFinish = (values: { username: string; password: string }) => {
        if (values.username === 'admin' && values.password === '123') {
            dispatch(setCurrentAccount({
                _id: '1',
                avatar: '1',
                email: '1',
                fullName: '1',
                phone: '1',
                userName: '1'
            }));
            dispatch(addAlert("success", "success", 5));
        } else {
            console.log("123");
            dispatch(addAlert("fail", "fail", 5));
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <Title level={2} className="login-title">
                    Defty Admin Portal
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
                        rules={[{ required: true, message: 'Please input your Username!' }]}
                    >
                        <Input placeholder="Username" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input.Password placeholder="Password" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Log in
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Login;