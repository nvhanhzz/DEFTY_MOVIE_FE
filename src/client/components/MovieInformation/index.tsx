import React from "react";
import { MdOutlineStar } from "react-icons/md";
import { FaPlay } from "react-icons/fa";
import { RiVipCrown2Fill } from "react-icons/ri";
import { MdOutlineIosShare } from "react-icons/md";
import { IoDownloadOutline } from "react-icons/io5";
import { MdOutlineBookmarkAdd } from "react-icons/md";
import { Movie } from "../MovieCard";
import "./MovieInformation.scss";
import SelectCustom from "../SelectCustom";

const MovieInformation: React.FC<Movie> = ({
                                                title,
                                                category,
                                                rating,
                                                releaseDate,
                                                description,
                                                thumbnail,
                                            }) => {
    return (
        <div className="movie-information">
            <div className="movie-information-overlay">
                <div className="movie-information-content">
                    <h1 className="movie-title">{title}</h1>
                    <p className="movie-info">
                        <span className="movie-rating">
                            <MdOutlineStar/> {rating}
                        </span> |{" "}
                        <span className="movie-release-date">{releaseDate}</span>
                    </p>
                    <div className="movie-category">
                        {category.map((tag, index) => (
                            <span key={index} className="movie-tag">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <div className="vip-button">
                        <RiVipCrown2Fill className="vip-button-icon" /> First month only đ23,000
                    </div>
                    <p className="movie-description">Description: <span className="movie-description-content">{description}</span></p>
                </div>
                <div className="movie-information-buttons">
                    <div className="button play-button"><FaPlay /> Play</div>
                    <div className="button other-button"><MdOutlineIosShare /> Share</div>
                    <div className="button other-button"><IoDownloadOutline /> APP</div>
                    <div className="button other-button"><MdOutlineBookmarkAdd /> Watch Later</div>
                </div>
                <div className="movie-information-navs">
                    <div className="nav nav-choose">Episodes</div>
                    <div className="nav">Cast</div>
                    <div className="nav">Collections</div>
                    <div className="nav">Recommended</div>
                </div>
                <hr className="movie-information-divider" />
                <SelectCustom />
            </div>

            <div className="movie-information-thumbnail">
                <img src={thumbnail} alt="thumbnail" />
                <div className="left-layer"></div>
                <div className="bottom-layer"></div>
            </div>
        </div>
    );
};

export default MovieInformation;