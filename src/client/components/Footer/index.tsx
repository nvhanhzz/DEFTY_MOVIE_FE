import React from "react";
import {DesktopOutlined, GlobalOutlined, LaptopOutlined, MobileOutlined, SearchOutlined} from "@ant-design/icons";
import "./Footer.scss";

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footer-top">
                <h3 className="footer-title">Trải nghiệm tốt nhất chỉ có trên DEFTY</h3>
                <p className="footer-description">
                    <SearchOutlined /> DEFTY Tìm kiếm trong cửa hàng ứng dụng dành cho thiết bị di động
                </p>
                <div className="footer-buttons">
                    <button className="footer-button"><DesktopOutlined /> Thiết bị đầu cuối máy tính</button>
                    <button className="footer-button"><MobileOutlined /> Điện thoại</button>
                    <button className="footer-button"><LaptopOutlined /> Trên TV</button>
                    <button className="footer-button"><GlobalOutlined /> Trên trang web</button>
                </div>
            </div>
            <div className="footer-links">
                <div className="footer-column">
                    <h4>Giới thiệu về chúng tôi</h4>
                    <ul>
                        <li>Thông tin công ty</li>
                        <li>Giới thiệu dịch vụ sản phẩm</li>
                        <li>Cách xem</li>
                        <li>Quan hệ nhà đầu tư</li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h4>Hợp tác</h4>
                    <ul>
                        <li>Đăng quảng cáo</li>
                        <li>Quan hệ kinh doanh</li>
                        <li>Hợp tác cài đặt trước</li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h4>Hỗ trợ và giúp đỡ</h4>
                    <ul>
                        <li>Phản ánh ý kiến</li>
                        <li>Trung tâm phản hồi bảo mật</li>
                        <li>Câu hỏi thường gặp</li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h4>Điều khoản dịch vụ</h4>
                    <ul>
                        <li>Điều khoản quyền riêng tư</li>
                        <li>Điều khoản sử dụng</li>
                        <li>Thiết lập Cookies</li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="footer-bottom-left">
                    <p>Copyright © 2025 DEFTY All Rights Reserved</p>
                    <p>
                        Chúng tôi sử dụng Cookies để cải thiện trải nghiệm sử dụng của bạn. Nếu bạn tiếp tục sử dụng trang web của chúng tôi, có nghĩa là bạn đồng ý chúng tôi sử dụng Cookies.
                        Đọc{" "}<a href="#">Chính sách quyền riêng tư DEFTY</a>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
