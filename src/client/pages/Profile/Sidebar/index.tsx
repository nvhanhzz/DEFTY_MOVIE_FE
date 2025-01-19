import React, { useState } from "react";
import { Link } from "react-router-dom";
import { UserOutlined, ClockCircleOutlined, HeartOutlined, BookOutlined, GlobalOutlined, LogoutOutlined } from "@ant-design/icons";
import "./Sidebar.scss";

const Sidebar: React.FC = () => {
    const [selectedItem, setSelectedItem] = useState<string>("personal");

    return (
        <aside className="sidebar">
            <button className="box-vip">Gia nhập VIP</button>
            <ul className="menu">
                <li className={`menu-item ${selectedItem === "personal" ? "active" : ""}`}>
                    <UserOutlined className="menu-icon" />
                    <Link to="/profile" onClick={() => setSelectedItem("personal")}>
                        Cài đặt cá nhân
                    </Link>
                </li>
                <li className={`menu-item ${selectedItem === "history" ? "active" : ""}`}>
                    <ClockCircleOutlined className="menu-icon" />
                    <Link to="/profile/history" onClick={() => setSelectedItem("history")}>
                        Lịch sử xem
                    </Link>
                </li>
                <li className={`menu-item ${selectedItem === "favorites" ? "active" : ""}`}>
                    <HeartOutlined className="menu-icon" />
                    <Link to="/profile/favorites" onClick={() => setSelectedItem("favorites")}>
                        Sưu tập của tôi
                    </Link>
                </li>
                <li className={`menu-item ${selectedItem === "booked" ? "active" : ""}`}>
                    <BookOutlined className="menu-icon" />
                    <Link to="/profile/booked" onClick={() => setSelectedItem("booked")}>
                        Phim đặt trước
                    </Link>
                </li>
                <li className={`menu-item ${selectedItem === "subtitles" ? "active" : ""}`}>
                    <GlobalOutlined className="menu-icon" />
                    <Link to="/profile/subtitles" onClick={() => setSelectedItem("subtitles")}>
                        Bản dịch phụ đề
                    </Link>
                </li>
                <li className={`menu-item ${selectedItem === "logout" ? "active" : ""}`}>
                    <LogoutOutlined className="menu-icon" />
                    <Link to="/" onClick={() => setSelectedItem("logout")}>
                        Đăng xuất
                    </Link>
                </li>
            </ul>
        </aside>
    );
};

export default Sidebar;
