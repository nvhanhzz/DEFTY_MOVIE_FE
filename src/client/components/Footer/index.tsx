import React from 'react';
import './Footer.scss';

const AppFooter: React.FC = () => {
    return (
        <div className="app-footer">
            <div className="footer-content">
                {/* About Section */}
                <div className="footer-section">
                    <h4>About Defty</h4>
                    <ul>
                        <li>About us</li>
                        <li>Products and Services</li>
                        <li>Ways to Watch</li>
                        <li>Investor Relations</li>
                    </ul>
                </div>
                {/* Cooperation Section */}
                <div className="footer-section">
                    <h4>Cooperation</h4>
                    <ul>
                        <li>Advertise</li>
                        <li>Corporate relations</li>
                        <li>Preinstall Cooperation</li>
                    </ul>
                </div>
                {/* Help and Support Section */}
                <div className="footer-section">
                    <h4>Help and Support</h4>
                    <ul>
                        <li>Feedback</li>
                        <li>Security Response Center</li>
                        <li>FAQ</li>
                    </ul>
                </div>
                {/* Terms Section */}
                <div className="footer-section">
                    <h4>Terms of Service</h4>
                    <ul>
                        <li>Privacy Policy</li>
                        <li>Terms of Service</li>
                        <li>Cookie settings</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AppFooter;
