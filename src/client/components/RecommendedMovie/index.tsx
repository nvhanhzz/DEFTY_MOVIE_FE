import React from "react";
import { MdOutlineStar } from "react-icons/md";
import { FaCirclePlay } from "react-icons/fa6";
import { MdOutlineBookmarkAdd } from "react-icons/md";
import { Movie } from "../MovieCard";
import "./RecommendedMovie.scss";

const RecommendedMovie: React.FC<Movie> = ({
                                                               name,
                                                               category,
                                                               rating,
                                                               releaseDate,
                                                               description,
                                                               thumbnail,
                                                           }) => {
    return (
        <div
            className="recommended-movie"
            style={{ backgroundImage: `url(${thumbnail})` }}
        >
            <div className="recommended-movie-overlay">
                <div className="recommended-movie-content">
                    <h1 className="movie-title">{name}</h1>
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
                    <p className="movie-description">{description}</p>
                </div>
                <div className="recommended-movie-buttons">
                    <FaCirclePlay className="play-icon"/>
                    <MdOutlineBookmarkAdd className="bookmark-icon"/>
                </div>
            </div>
        </div>
    );
};

export default RecommendedMovie;