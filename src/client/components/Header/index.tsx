import React, {useEffect, useState} from 'react';
import './Header.scss';
import { CiSearch } from "react-icons/ci";
import { RiHistoryFill } from "react-icons/ri";
import { MdLanguage } from "react-icons/md";
import { FiUser } from "react-icons/fi";
import { FcVip } from "react-icons/fc";
import {Link, useLocation} from "react-router-dom";
import { MdOutlineFileDownload } from "react-icons/md";
import { IoMenu } from "react-icons/io5";
import Dropdown from "../Dropdown";

const PREFIX_URL_PROFILE: string = import.meta.env.VITE_PREFIX_URL_PROFILE as string;
const PREFIX_URL_ALBUM: string = import.meta.env.VITE_PREFIX_URL_ALBUM as string;

const AppHeader: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();

    const getHeaderClass = () => {
        const path = location.pathname;

        return (path.startsWith("/" + PREFIX_URL_ALBUM) || path === '/');
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <>
            <header className={`header-wrapper ${getHeaderClass() ? "" : "header-wrapper-background"}`}>
                <div className={`header ${isScrolled ? "header--scrolled" : ""}`}>
                    <div className="header__left">
                        <div className="header__left--menu">
                            <IoMenu/>
                        </div>
                        <Link to="/" className="header__left--logo">
                            <img src="/assets/images/defty.png" alt="logo" />
                        </Link>
                        <Link to="/" className="header__left--link active">For You</Link>
                        <Dropdown trigger={<div className="header__left--dropdown-trigger">More</div>}>
                            <div className="header__left--dropdown-item">Option 1</div>
                            <div className="header__left--dropdown-item">Option 2</div>
                            <div className="header__left--dropdown-item">Option 3</div>
                        </Dropdown>
                    </div>
                    <div className="header__right">
                        <div className="header__right--search">
                            <input type="text" placeholder="search" />
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
                                <Link to={PREFIX_URL_PROFILE} className="profile-link">
                                    <FiUser className="profile-icon"/>
                                    <span className="profile-text">Me</span>
                                </Link>
                            </div>
                        </div>
                        <div className="header__right--app">
                            <MdOutlineFileDownload/>
                            <span>APP</span>
                        </div>
                        <div className="header__right--vip">
                            <FcVip/>
                        </div>
                    </div>
                </div>

                <div className="header_category">
                    <Link to="/" className="header_category--link active">For You</Link>
                    <Link to="/" className="header_category--link">Anime</Link>
                    <Link to="/" className="header_category--link">Movie</Link>
                    <Link to="/" className="header_category--link">Drama</Link>
                    <Link to="/" className="header_category--link">Lady</Link>
                </div>
            </header>
        </>
    );
};

export default AppHeader;
