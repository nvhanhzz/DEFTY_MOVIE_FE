import React from 'react';
import './Header.scss';
import {Link} from "react-router-dom";

const AppHeader: React.FC = () => {
    return (
        <div className="header">
            <div className="header__left">
                <h2 className="header__logo">Defty</h2>
                <Link to="/" className="header__link">For you</Link>
                <div className="header__dropdown">
                    <div className="header__dropdown-trigger">More</div>
                    <div className="header__dropdown-menu">
                        <a href="/option1" className="header__dropdown-item">Option 1</a>
                        <a href="/option2" className="header__dropdown-item">Option 2</a>
                        <a href="/option3" className="header__dropdown-item">Option 3</a>
                    </div>
                </div>
            </div>
            <div className="header__right">
                <h1 className="header__title">Right</h1>
            </div>
        </div>
    );
};

export default AppHeader;
