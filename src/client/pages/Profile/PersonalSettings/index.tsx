import React from 'react';
import './PersonalSettings.scss';

const PersonalSettings: React.FC = () => {
    return (
        <>
            <h1 className="title">Cài đặt cá nhân</h1>
            <div className="cardContainer">
                <h3 className="cardTitle">Thông tin cá nhân</h3>
                <div className="card">
                    <div className="infoContainer">
                        <div className="avatar">
                            <img
                                src="./assets/images/default.jpg"
                                alt="Avatar"
                                className="avatarImage"
                            />
                        </div>

                        <div className="details">
                            <p className="details-name">
                                <strong>B21DCCN785 - Nguyễn Viết Văn</strong>
                            </p>
                            <div className="details-info">
                                <p>Giới tính: <span>Không được thiết lập</span></p>
                                <p className="separator">|</p>
                                <p>Ngày sinh: <span>1919-01-01</span></p>
                                <p className="separator">|</p>
                                <p>UID: <span>34040412263</span></p>
                            </div>
                        </div>
                        <button className="editButton">Chỉnh sửa</button>
                    </div>
                </div>
            </div>


            <div className="vip-container">
                <h2 className="vip-title">VIP</h2>
                <section className="vip-card">
                    <div className="vip-card-content">
                        <h3>Trở thành VIP</h3>
                        <p>Tham gia VIP để xem kho phim HD, đồng thời còn có thể bỏ qua quảng cáo</p>
                    </div>
                    <button className="vip-card-button">Đăng ký VIP</button>
                </section>
            </div>


            <div className="account-info-container">
                <h3 className="account-info-title">Tài khoản và bảo mật</h3>
                <section className="account-info">
                    <table className="account-info-table">
                        <tbody>
                        <tr>
                            <td><p>Email</p></td>
                            <td>ng****@gmail.com</td>
                            <td>
                                <button className="action-button">Kích hoạt</button>
                            </td>
                        </tr>
                        <tr>
                            <td><p>Số điện thoại</p></td>
                            <td>Không được thiết lập</td>
                            <td>
                                <button className="action-button">Cài đặt</button>
                            </td>
                        </tr>
                        <tr>
                            <td><p>Mật khẩu</p></td>
                            <td>Không được thiết lập</td>
                            <td>
                                <button className="action-button">Cài đặt</button>
                            </td>
                        </tr>
                        <tr>
                            <td><p>Quản lý gia hạn tự động</p></td>
                            <td>Bạn chưa kích hoạt tự động gia hạn</td>
                            <td>
                                <button className="action-button">Sửa đổi</button>
                            </td>
                        </tr>
                        <tr>
                            <td><p>Xóa tài khoản</p></td>
                            <td>Xóa tài khoản hiện tại</td>
                            <td>
                                <button className="action-button">Xóa bỏ</button>
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
