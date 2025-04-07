import React from "react";
import {DesktopOutlined, GlobalOutlined, LaptopOutlined, MobileOutlined, SearchOutlined} from "@ant-design/icons";
import "./Footer.scss";

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footer-top">
                <h3 className="footer-title">The best experience only on DEFTY</h3>
                <p className="footer-description">
                    <SearchOutlined /> DEFTY Search in the mobile app store
                </p>
                <div className="footer-buttons">
                    <button className="footer-button"><DesktopOutlined /> Desktop Devices</button>
                    <button className="footer-button"><MobileOutlined /> Mobile Phones</button>
                    <button className="footer-button"><LaptopOutlined /> On TV</button>
                    <button className="footer-button"><GlobalOutlined /> On the Web</button>
                </div>
            </div>
            <div className="footer-links">
                <div className="footer-column">
                    <h4>About Us</h4>
                    <ul>
                        <li>Company Information</li>
                        <li>Product Service Introduction</li>
                        <li>How to Watch</li>
                        <li>Investor Relations</li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h4>Partnership</h4>
                    <ul>
                        <li>Advertise with Us</li>
                        <li>Business Relations</li>
                        <li>Pre-installed Partnerships</li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h4>Support & Help</h4>
                    <ul>
                        <li>Feedback</li>
                        <li>Security Feedback Center</li>
                        <li>FAQ</li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h4>Terms of Service</h4>
                    <ul>
                        <li>Privacy Policy</li>
                        <li>Terms of Use</li>
                        <li>Cookie Settings</li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="footer-bottom-left">
                    <p>Copyright © 2025 DEFTY All Rights Reserved</p>
                    <p>
                        We use Cookies to improve your experience. By continuing to use our website, you agree to our use of Cookies.
                        Read <a href="#">DEFTY Privacy Policy</a>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;