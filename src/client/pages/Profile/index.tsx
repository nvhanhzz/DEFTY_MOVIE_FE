import React, { useState, useEffect, useCallback } from "react";
import "./Profile.scss"; // Import SCSS
import Sidebar from "./Sidebar"; // Import Sidebar component
import { Outlet } from "react-router-dom";
import { MenuOutlined, CloseOutlined } from '@ant-design/icons'; // Icons cho nút toggle

const Profile: React.FC = () => {
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