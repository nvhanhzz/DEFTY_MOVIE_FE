import React from 'react';
import './Header.scss';
import { CiSearch } from "react-icons/ci";
import { RiHistoryFill } from "react-icons/ri";
import { MdLanguage } from "react-icons/md";
import { FiUser } from "react-icons/fi";
import { FcVip } from "react-icons/fc";
import { Link } from "react-router-dom";
import Dropdown from "../Dropdown";

const AppHeader: React.FC = () => {
    return (
        <header className="header">
            <div className="header__left">
                <Link to="/" className="header__left--logo">
                    <img src="../../../../public/assets/images/defty.png" alt="logo" />
                </Link>
                <Link to="/" className="header__left--link">For you</Link>
                <Dropdown trigger={<div className="header__left--dropdown-trigger">More</div>}>
                    <div className="header__left--dropdown-item">Option 1</div>
                    <div className="header__left--dropdown-item">Option 2</div>
                    <div className="header__left--dropdown-item">Option 3</div>
                </Dropdown>
            </div>
            <div className="header__right">
                <div className="header__right--search">
                    <input type="text" placeholder="Search" />
                    <CiSearch />
                </div>
                <div className="header__right--information">
                    <div className="header__right--information--item">
                        <RiHistoryFill/>
                        <span>History</span>
                    </div>
                    <div className="header__right--information--item">
                        <MdLanguage />
                        <span>Language</span>
                    </div>
                    <div className="header__right--information--item">
                        <Link to="/profile" className="profile-link">
                            <FiUser className="profile-icon"/>
                            <span className="profile-text">Me</span>
                        </Link>
                    </div>
                </div>
                <div className="header__right--vip">
                    <FcVip/>
                </div>
            </div>
        </header>
    );
};

export default AppHeader;
