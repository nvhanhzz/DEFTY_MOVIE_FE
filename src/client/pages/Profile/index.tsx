import React, { useState, useEffect, useCallback } from "react";
import "./Profile.scss"; // Import SCSS
import Sidebar from "./Sidebar"; // Import Sidebar component
import {Outlet, useNavigate} from "react-router-dom";
import { MenuOutlined, CloseOutlined } from '@ant-design/icons';
import useUserStore from "../../store/UserStore.tsx"; // Icons cho nút toggle

const Profile: React.FC = () => {
    const user = useUserStore(state => state.user);
    const isLoading = useUserStore(state => state.isLoading);
    const navigate = useNavigate();
    // State quản lý trạng thái mở/đóng của sidebar trên mobile
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    // State xác định có phải màn hình mobile không
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    // Hàm kiểm tra kích thước màn hình
    const checkMobile = useCallback(() => {
        const mobile = window.innerWidth <= 768;
        setIsMobile(mobile);
        // Tự động đóng sidebar nếu chuyển sang desktop
        if (!mobile) {
            setIsSidebarOpen(false);
        }
    }, []);

    useEffect(() => {
        // Chỉ thực hiện kiểm tra KHI loading đã hoàn thành (isLoading = false)
        if (!isLoading && !user) {
            console.log("Profile: Not loading and no user, redirecting to /");
            navigate('/');
        }
    }, [user, isLoading, navigate]);

    // Lắng nghe sự kiện resize
    useEffect(() => {
        window.addEventListener('resize', checkMobile);
        checkMobile(); // Kiểm tra lần đầu
        return () => window.removeEventListener('resize', checkMobile);
    }, [checkMobile]);

    // Hàm bật/tắt sidebar
    const toggleSidebar = () => {
        // Chỉ cho phép toggle trên mobile
        if (isMobile) {
            setIsSidebarOpen(!isSidebarOpen);
        }
    };

    // Ngăn cuộn body khi sidebar mobile mở
    useEffect(() => {
        if (isSidebarOpen && isMobile) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isSidebarOpen, isMobile]);

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                Loading Profile Information...
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <>
            {/* Nút Toggle - Chỉ hiển thị trên mobile */}
            {isMobile && (
                <button
                    className={`sidebar-toggle-button ${isSidebarOpen ? 'is-open' : ''}`}
                    onClick={toggleSidebar}
                    aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
                >
                    {isSidebarOpen ? <CloseOutlined /> : <MenuOutlined />}
                </button>
            )}

            <div className={"container"}>
                {/* Truyền class 'is-open' vào Sidebar KHI VÀ CHỈ KHI ở mobile VÀ state là open */}
                <Sidebar className={isSidebarOpen && isMobile ? 'is-open' : ''} />

                <main className="main-content">
                    <Outlet />
                </main>

                {/* Overlay - Chỉ hiển thị khi sidebar mobile mở */}
                {isSidebarOpen && isMobile && (
                    <div className="sidebar-overlay" onClick={toggleSidebar}></div>
                )}
            </div>
        </>
    );
};

export default Profile;