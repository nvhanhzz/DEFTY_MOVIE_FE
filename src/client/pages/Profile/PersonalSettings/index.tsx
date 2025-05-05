import React from 'react';
import './PersonalSettings.scss';
import useUserStore from "../../../store/UserStore.tsx";

const PersonalSettings: React.FC = () => {
    const user = useUserStore(state => state.user);

    return (
        <>
            {/* Title translated */}
            <h1 className="title">Personal Settings</h1>

            {/* Personal Information Card */}
            <div className="cardContainer">
                {/* Card title translated */}
                <h3 className="cardTitle">Personal Information</h3>
                <div className="card">
                    <div className="infoContainer">
                        <div className="avatar">
                            <img
                                src={
                                    user && user.avatar // Kiểm tra xem user tồn tại và có thuộc tính avatar không
                                        ? user.avatar      // Nếu có, sử dụng user.avatar
                                        : ( // Nếu không, sử dụng logic cũ dựa trên giới tính
                                            user && user.gender.toLowerCase() === 'female'
                                                ? '/assets/images/female_avt_default.jpg'
                                                : '/assets/images/male_avt_default.jpg'
                                        )
                                }
                                alt="Avatar"
                                className="avatarImage"
                            />
                        </div>

                        <div className="details">
                            <p className="details-name">
                                {/* Assuming the name/ID part remains the same */}
                                <strong>{user?.fullName}</strong>
                            </p>
                            <div className="details-info">
                                {/* Labels and status translated */}
                                <p>Gender: <span>{user?.gender ? user.gender : "Not set"}</span></p>
                                <p className="separator">|</p>
                                <p>Date of Birth: <span>{user?.dateOfBirth ? user.dateOfBirth : "Not set"}</span></p>
                            </div>
                        </div>
                        {/* Button text translated */}
                        <button className="editButton">Edit</button>
                    </div>
                </div>
            </div>

            {/* VIP Section */}
            <div className="vip-container">
                <h2 className="vip-title">VIP</h2>
                <section className="vip-card">
                    <div className="vip-card-content">
                        {/* Title and description translated */}
                        <h3>Become a VIP</h3>
                        <p>Join VIP to watch the HD movie library and skip ads.</p>
                    </div>
                    {/* Button text translated */}
                    <button className="vip-card-button">Subscribe to VIP</button>
                </section>
            </div>

            {/* Account and Security Section */}
            <div className="account-info-container">
                {/* Title translated */}
                <h3 className="account-info-title">Account and Security</h3>
                <section className="account-info">
                    <table className="account-info-table">
                        <tbody>
                        <tr>
                            {/* Label translated */}
                            <td><p>Email</p></td>
                            <td>{user?.email ? user.email : "Not set"}</td>
                            <td>
                                {/* Button text translated */}
                                <button className="action-button">Activate</button>
                            </td>
                        </tr>
                        <tr>
                            {/* Label and status translated */}
                            <td><p>Phone Number</p></td>
                            <td>{user?.phone ? user.phone : "Not set"}</td>
                            <td>
                                {/* Button text translated */}
                                <button className="action-button">Set Up</button>
                            </td>
                        </tr>
                        <tr>
                            {/* Label and status translated */}
                            <td><p>Password</p></td>
                            <td>Not Set</td>
                            <td>
                                {/* Button text translated */}
                                <button className="action-button">Set Up</button>
                            </td>
                        </tr>
                        <tr>
                            {/* Label and status translated */}
                            <td><p>Manage Auto-Renewal</p></td>
                            <td>You have not enabled auto-renewal.</td>
                            <td>
                                {/* Button text translated */}
                                <button className="action-button">Modify</button>
                            </td>
                        </tr>
                        <tr>
                            {/* Label and status translated */}
                            <td><p>Delete Account</p></td>
                            <td>Delete the current account.</td>
                            <td>
                                {/* Button text translated */}
                                <button className="action-button">Delete</button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </section>
            </div>
        </>
    );
};

export default PersonalSettings;