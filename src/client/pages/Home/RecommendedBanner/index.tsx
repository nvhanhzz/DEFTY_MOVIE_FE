import React from "react";
import { MdOutlineStar } from "react-icons/md";
import { FaCirclePlay } from "react-icons/fa6";
import { MdOutlineBookmarkAdd } from "react-icons/md";
import { Movie } from "../MovieCard";
import "./RecommendedBanner.scss";

const RecommendedBanner: React.FC<Movie> = ({
                                                               title,
                                                               category,
                                                               rating,
                                                               releaseDate,
                                                               description,
                                                               thumbnail,
                                                           }) => {
    console.log("RecommendedBanner", title, category, rating, releaseDate);
    return (
        <div
            className="recommended-banner"
            style={{ backgroundImage: `url(${thumbnail})` }}
        >
            <div className="recommended-banner-overlay">
                <div className="recommended-banner-content">
                    <h1 className="banner-title">{title}</h1>
                    <p className="banner-info">
                        <span className="banner-rating">
                            <MdOutlineStar/> {rating}
                        </span> |{" "}
                        <span className="banner-release-date">{releaseDate}</span>
                    </p>
                    <div className="banner-category">
                        {category.map((tag, index) => (
                            <span key={index} className="banner-tag">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <p className="banner-description">{description}</p>
                </div>
                <div className="recommended-banner-buttons">
                    <FaCirclePlay className="play-icon"/>
                    <MdOutlineBookmarkAdd className="bookmark-icon"/>
                </div>
            </div>
        </div>
    );
};

export default RecommendedBanner;