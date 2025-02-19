import React from "react";
import { useAdminSelector } from "../../hooks/useAdminSelector.tsx";
import './Profile.scss';
import {Button, Image} from "antd";  // Import file SCSS
import { EditOutlined } from "@ant-design/icons";
import {useNavigate} from "react-router-dom";

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const currentAccount = useAdminSelector((state) => state.currentAccount.account);

    if (!currentAccount) return <div>Loading...</div>;

    return (
        <div className="profile-container">
            <div className="profile-edit">
                <Button icon={ <EditOutlined/> } onClick={() => {navigate("update")}} />
            </div>
            <div className="profile-header">
                <Image
                    width={150}  // Điều chỉnh kích thước ảnh nếu cần
                    height={150}
                    style={{
                        objectFit: 'cover',
                        borderRadius: '50%'
                    }}
                    src={currentAccount.avatar}  // Đường dẫn ảnh
                    alt="avatar"
                />
                <h2 className="profile-fullname">{currentAccount.fullName}</h2>
                <span className="profile-role">{currentAccount.role}</span>
            </div>
            <div className="profile-details">
                <div className="profile-info">
                    <strong>Username:</strong>
                    <p>{currentAccount.username}</p>
                </div>
                <div className="profile-info">
                    <strong>Email:</strong>
                    <p>{currentAccount.email}</p>
                </div>
                <div className="profile-info">
                    <strong>Phone:</strong>
                    <p>{currentAccount.phone}</p>
                </div>
                <div className="profile-info">
                    <strong>Gender:</strong>
                    <p>{currentAccount.gender}</p>
                </div>
                <div className="profile-info">
                    <strong>Address:</strong>
                    <p>{currentAccount.address}</p>
                </div>
                <div className="profile-info">
                    <strong>Date of Birth:</strong>
                    <p>{new Date(currentAccount.dateOfBirth).toLocaleDateString()}</p>
                </div>
                {/*<div className="profile-info">*/}
                {/*    <strong>Status:</strong>*/}
                {/*    <Tag*/}
                {/*        color={currentAccount.status === '1' ? 'green' : 'red'}*/}
                {/*        style={{*/}
                {/*            display: 'block',*/}
                {/*            width: '80px',*/}
                {/*            fontSize: '14px',*/}
                {/*            padding: '4px 10px',*/}
                {/*            borderRadius: '4px',*/}
                {/*            textAlign: 'center',*/}
                {/*            marginTop: '5px',*/}
                {/*        }}*/}
                {/*    >*/}
                {/*        {currentAccount.status === '1' ? "Active" : "Inactive"}*/}
                {/*    </Tag>*/}
                {/*</div>*/}
            </div>
        </div>
    );
};

export default Profile;