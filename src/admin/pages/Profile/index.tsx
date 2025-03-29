import React from "react";
import {Button, DatePicker, Form, Image, Input, Select} from "antd";
import {useAdminSelector} from "../../hooks/useAdminSelector.tsx";
import {useNavigate} from "react-router-dom";
import dayjs from "dayjs";
import "./Profile.scss";

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const currentAccount = useAdminSelector((state) => state.currentAccount.account);

    if (!currentAccount) return <div className="loading">Loading...</div>;

    return (
        <div className="update-profile-container">
            <Form
                layout="vertical"
                className="profile-form">
            <div className="profile-header">
                <Image
                    width={150}
                    height={150}
                    style={{objectFit: "cover", borderRadius: "50%"}}
                    src={currentAccount.avatar}
                    alt="avatar"
                    className="avatar-wrapper"
                />
            </div>
            <div className="profile-details">
                <div className="left-column">
                    <Form.Item
                        label="Full Name"
                        name="fullName"
                        required>
                        <Input defaultValue={currentAccount.fullName}/>
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email">
                        <Input defaultValue={currentAccount.email}/>
                    </Form.Item>
                    <Form.Item
                        label="Username"
                        name="username">
                        <Input defaultValue={currentAccount.username}
                               disabled/>
                    </Form.Item>
                    <Form.Item
                        label="Phone"
                        name="phone">
                        <Input defaultValue={currentAccount.phone}/>
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password">
                        <Input.Password placeholder="Enter your password"/>
                    </Form.Item>

                </div>
                <div className="right-column">
                    <Form.Item
                        label="Date of Birth"
                        name="dateOfBirth">
                        <DatePicker
                            defaultValue={currentAccount.dateOfBirth ? dayjs(currentAccount.dateOfBirth) : null}
                            format="YYYY-MM-DD"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Role"
                        name="role">
                        <Select defaultValue={currentAccount.role?.toLowerCase()}>
                            <Select.Option value="admin">Admin</Select.Option>
                            <Select.Option value="user">User</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Gender"
                        name="gender">
                        <Select defaultValue={currentAccount.gender?.toLowerCase()}>
                            <Select.Option value="male">Male</Select.Option>
                            <Select.Option value="female">Female</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Address"
                        name="address">
                        <Input.TextArea defaultValue={currentAccount.address}/>
                    </Form.Item>
                </div>
                <Form.Item>
                    <Button type="primary" onClick={() => navigate("update")}>Update</Button>
                </Form.Item>
            </div>
            </Form>
        </div>

    );
};
export default Profile;
