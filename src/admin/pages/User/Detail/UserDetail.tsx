import React, { useEffect, useState } from 'react';
import { Modal, Spin, message } from 'antd';
import { getUserById } from "../../../services/userService.tsx";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import "./UserDetail.scss"; // Import the SCSS file directly
import { Image } from 'antd';

export interface UserDetailProps {
    visible: boolean;
    onClose: () => void;
    userId: string | null;
}

export interface User {
    id: string;
    username: string;
    email: string;
    fullName: string;
    phone: string;
    gender: string;
    address: string;
    avatar: string;
    status: number;
    dateOfBirth: Date;
}

const UserDetail: React.FC<UserDetailProps> = ({ visible, onClose, userId }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { t } = useTranslation();

    useEffect(() => {
        if (visible && userId) {
            fetchUserDetails(userId);
        }
    }, [visible, userId]);

    const fetchUserDetails = async (id: string) => {
        setIsLoading(true);
        try {
            const response = await getUserById(id);
            const result = await response.json();
            if (response.ok && result.status === 200) {
                setUser(result.data);
            } else {
                message.error("Failed to fetch user details.");
            }
        } catch (error) {
            message.error("An error occurred while fetching user details.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            title={t('admin.user.detail.title')}
            onCancel={onClose}
            footer={null}
        >
            {isLoading ? (
                <div style={{ textAlign: 'center' }}>
                    <Spin />
                </div>
            ) : user ? (
                <div className="user-detail">
                    <div className="user-detail__item user-detail__item--avatar">
                        <div className="user-detail__avatar-container">
                            <Image
                                className="user-detail__avatar"
                                src={user.avatar || 'default-avatar.png'} // Fallback image
                                alt={`${user.fullName}'s Avatar`}
                                width={100} // Avatar display size
                                height={100}
                                preview={{
                                    mask: 'Preview', // Custom preview mask text
                                }}
                            />
                        </div>
                    </div>
                    <div className="user-detail__item">
                        <span className="user-detail__item-label">
                            {t('admin.user.username')}:
                        </span>
                        <span className="user-detail__item-value">
                            {user.username}
                        </span>
                    </div>
                    <div className="user-detail__item">
                        <span className="user-detail__item-label">
                            {t('admin.user.fullName')}:
                        </span>
                        <span className="user-detail__item-value">
                            {user.fullName}
                        </span>
                    </div>
                    <div className="user-detail__item">
                        <span className="user-detail__item-label">
                            {t('admin.user.email')}:
                        </span>
                        <span className="user-detail__item-value">
                            {user.email}
                        </span>
                    </div>
                    <div className="user-detail__item">
                        <span className="user-detail__item-label">
                            {t('admin.user.phone')}:
                        </span>
                        <span className="user-detail__item-value">
                            {user.phone}
                        </span>
                    </div>
                    <div className="user-detail__item">
                        <span className="user-detail__item-label">
                            {t('admin.user.gender.title')}:
                        </span>
                        <span className="user-detail__item-value">
                            {user.gender}
                        </span>
                    </div>
                    <div className="user-detail__item">
                        <span className="user-detail__item-label">
                            {t('admin.user.address')}:
                        </span>
                        <span className="user-detail__item-value">
                            {user.address}
                        </span>
                    </div>
                    <div className="user-detail__item">
                        <span className="user-detail__item-label">
                            {t('admin.dataList.status.title')}:
                        </span>
                        <span className="user-detail__item-value">
                            {user.status === 1 ? t('admin.dataList.status.active') : t('admin.dataList.status.inactive')}
                        </span>
                    </div>
                    <div className="user-detail__item">
                        <span className="user-detail__item-label">
                            {t('admin.user.dateOfBirth')}:
                        </span>
                        <span className="user-detail__item-value">
                            {user.dateOfBirth ? dayjs(user.dateOfBirth).format('DD/MM/YYYY') : ''}
                        </span>
                    </div>
                </div>
            ) : (
                <p>{t('admin.user.detail.notFound')}:</p>
            )}
        </Modal>
    );
};

export default UserDetail;