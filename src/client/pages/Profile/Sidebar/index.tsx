import React, { useState } from 'react';
import {useNavigate} from "react-router-dom";
import { UserOutlined, ClockCircleOutlined, HeartOutlined, BookOutlined, GlobalOutlined, LogoutOutlined } from "@ant-design/icons";
import "./Sidebar.scss";
import {postLogout} from "../../../services/auth.tsx";
import {message} from "antd";
import useUserStore from "../../../store/UserStore.tsx";
import {FiLoader} from "react-icons/fi"; // Assuming your SCSS file is named this

interface SidebarProps {
    className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<string>("personal");
    const navigate = useNavigate();
    const clearUserStore = useUserStore(state => state.clearUser);
    const spinnerStyle: React.CSSProperties = { animation: 'spin 1s linear infinite', display: 'inline-block' };

    const handleLogout = () => {
        // Don't hide popup immediately, wait for API call
        const logoutUser = async () => {
            setIsLoading(true); // Start loading indicator for logout button
            try {
                const response = await postLogout();
                if (!response.body) throw new Error("Empty logout response");
                const result = await response.json();

                if (!response.ok || !(result.status === 200)) {
                    (message.error || message.success)("Logout fail!", 5);
                    // Keep popup open on failure
                    return;
                }
                // Success case: Clear store, hide popups, show message
                clearUserStore();
                message.success("Logged out successfully!", 5);

            } catch (error) {
                console.error("Logout Error:", error);
                (message.error || message.success)(error instanceof Error ? error.message : "An unexpected error occurred.", 5);
                // Keep popup open on error
            } finally {
                setIsLoading(false); // Stop loading indicator
            }
        }
        logoutUser();
    };

    return (
        <aside className={`sidebar ${className || ''}`}>
            <button className="box-vip">Join VIP</button>
            <ul className="menu">
                <li className={`menu-item ${selectedItem === "personal" ? "active" : ""}`} onClick={() => {navigate("/profile"); setSelectedItem("personal")}}>
                    <UserOutlined className="menu-icon" />
                    {/* Add className="menu-link-text" */}
                    <div className="menu-link-text">
                        Personal Settings
                    </div>
                </li>
                <li className={`menu-item ${selectedItem === "history" ? "active" : ""}`} onClick={() => {navigate("/profile/history"); setSelectedItem("history")}}>
                    <ClockCircleOutlined className="menu-icon" />
                    {/* Add className="menu-link-text" */}
                    <div className="menu-link-text">
                        Watch History
                    </div>
                </li>
                <li className={`menu-item ${selectedItem === "favorites" ? "active" : ""}`} onClick={() => {
                    navigate("/profile/favorites"); setSelectedItem("favorites")
                }}>
                    <HeartOutlined className="menu-icon" />
                    {/* Add className="menu-link-text" */}
                    <div className="menu-link-text">
                        My Favorites
                    </div>
                </li>
                <li className={`menu-item ${selectedItem === "booked" ? "active" : ""}`} onClick={() => {
                    navigate("/profile/booked");
                    setSelectedItem("booked")
                }}>
                    <BookOutlined className="menu-icon" />
                    {/* Add className="menu-link-text" */}
                    <div className="menu-link-text">
                        Booked Movies
                    </div>
                </li>
                <li className={`menu-item ${selectedItem === "subtitles" ? "active" : ""}`} onClick={() => {
                    navigate("/profile/subtitles");
                    setSelectedItem("subtitles")
                }}>
                    <GlobalOutlined className="menu-icon" />
                    {/* Add className="menu-link-text" */}
                    <div className="menu-link-text">
                        Subtitle Settings
                    </div>
                </li>
                <li className={`menu-item ${selectedItem === "logout" ? "active" : ""}`} onClick={() => {
                    navigate("/");
                    handleLogout();
                }}>
                    <LogoutOutlined className="menu-icon" />
                    {/* Add className="menu-link-text" */}
                    <div className="menu-link-text">
                        {isLoading ? (
                            <FiLoader style={spinnerStyle} size={14} />
                        ) : (
                            <>
                                Logout
                            </>
                        )}
                    </div>
                </li>
            </ul>
        </aside>
    );
};

export default Sidebar;