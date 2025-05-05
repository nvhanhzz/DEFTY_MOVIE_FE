import React from 'react';
import './PersonalSettings.scss';
import useUserStore from "../../../store/UserStore.tsx";

const PersonalSettings: React.FC = () => {
    const user = useUserStore(state => state.user);

    if (!user) {
        return null;
    }

    const fallbackInitial = user.fullName ? user.fullName.charAt(0).toUpperCase() : '?';

    return (
        <>
            {/* Title */}
            <h1 className="personal-settings__title">Personal Settings</h1>

            {/* Personal Information Card */}
            <div className="personal-settings__card-container">
                <h3 className="personal-settings__card-title">Personal Information</h3>
                <div className="personal-settings__card">
                    <div className="personal-settings__info-container">
                        {/* --- Updated Avatar Section --- */}
                        <div className="personal-settings__avatar-container">
                            {user.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.fullName || 'Avatar'}
                                    className="personal-settings__avatar-image"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.onerror = null; // Prevent infinite loop
                                        // Option 1: Use placehold.co URL
                                        // target.src = fallbackPlaceholderUrl;
                                        // Option 2: Hide image and show placeholder div
                                        target.style.display = 'none';
                                        const placeholder = target.nextElementSibling as HTMLElement;
                                        if (placeholder) {
                                            placeholder.style.display = 'flex';
                                        }
                                    }}
                                />
                            ) : null /* Render nothing initially if no avatar URL */}
                            {/* Placeholder Div */}
                            <div
                                className="personal-settings__avatar-placeholder"
                                style={{ display: user.avatar ? 'none' : 'flex' }} // Show if no avatar or img errors
                            >
                                {fallbackInitial}
                            </div>
                        </div>
                        {/* --- End Updated Avatar Section --- */}


                        <div className="personal-settings__details">
                            <p className="personal-settings__details-name">
                                <strong>{user.fullName}</strong> {/* Removed optional chaining as user is guaranteed here */}
                            </p>
                            <div className="personal-settings__details-info">
                                <p>Gender: <span>{user.gender ? user.gender : "Not set"}</span></p>
                                <p className="personal-settings__separator">|</p>
                                <p>Date of Birth: <span>{user.dateOfBirth ? user.dateOfBirth : "Not set"}</span></p>
                            </div>
                        </div>
                        <button className="personal-settings__edit-button">Edit</button>
                    </div>
                </div>
            </div>

            {/* VIP Section */}
            <div className="personal-settings__vip-container">
                <h2 className="personal-settings__vip-title">VIP</h2>
                <section className="personal-settings__vip-card">
                    <div className="personal-settings__vip-card-content">
                        <h3>Become a VIP</h3>
                        <p>Join VIP to watch the HD movie library and skip ads.</p>
                    </div>
                    <button className="personal-settings__vip-card-button">Subscribe to VIP</button>
                </section>
            </div>

            {/* Account and Security Section */}
            <div className="personal-settings__account-info-container">
                <h3 className="personal-settings__account-info-title">Account and Security</h3>
                <section className="personal-settings__account-info">
                    <table className="personal-settings__account-info-table">
                        <tbody>
                        <tr>
                            <td><p>Email</p></td>
                            <td>{user.email ? user.email : "Not set"}</td>
                            <td><button className="personal-settings__action-button">Activate</button></td>
                        </tr>
                        <tr>
                            <td><p>Phone Number</p></td>
                            <td>{user.phone ? user.phone : "Not set"}</td>
                            <td><button className="personal-settings__action-button">Set Up</button></td>
                        </tr>
                        <tr>
                            <td><p>Password</p></td>
                            {/* Assuming password status isn't directly stored in user object */}
                            <td>Set</td>
                            <td><button className="personal-settings__action-button">Modify</button></td>
                        </tr>
                        <tr>
                            <td><p>Manage Auto-Renewal</p></td>
                            {/* This status likely comes from another source/API call */}
                            <td>You have not enabled auto-renewal.</td>
                            <td><button className="personal-settings__action-button">Modify</button></td>
                        </tr>
                        <tr>
                            <td><p>Delete Account</p></td>
                            <td>Delete the current account.</td>
                            <td><button className="personal-settings__action-button personal-settings__action-button--delete">Delete</button></td>
                        </tr>
                        </tbody>
                    </table>
                </section>
            </div>
        </>
    );
};

export default PersonalSettings;
