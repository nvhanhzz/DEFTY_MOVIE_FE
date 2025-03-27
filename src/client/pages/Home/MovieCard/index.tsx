import React from "react";
import "./MovieCard.scss";
import {MdOutlineBookmarkAdd} from "react-icons/md";
import {Link, useNavigate} from "react-router-dom";
import {FaPlay} from "react-icons/fa";
import { IoMdStar } from "react-icons/io";
import dayjs from "dayjs";

const PREFIX_URL_ALBUM: string = import.meta.env.VITE_PREFIX_URL_ALBUM as string;

export interface MovieShowOn {
    movieThumbnail: string;
    movieTitle: string;
    description: string;
    numberOfChild: number;
    releaseDate: string | null;
    slug: string;
}

const MovieCard: React.FC<MovieShowOn> = (movieShowOn: MovieShowOn) => {
    const navigate = useNavigate();

    const handleNavigateDetail = () => {
        navigate(`/${PREFIX_URL_ALBUM}/${movieShowOn.slug}`);
    }

    return (
        <div className="movie-card" onClick = {handleNavigateDetail}>
            <div className="movie-card-wrapper">
                <div className="info">
                    <img src={movieShowOn.movieThumbnail} alt="thumbnail"/>
                    <div className="movie-title">{movieShowOn.movieTitle}</div>
                </div>
                <div className="info-hover">
                    <div className="hover-info">
                        <img src={movieShowOn.movieThumbnail} alt="thumbnail"/>
                        <div className="movie-card-buttons">
                            <div className="play-icon">
                                <FaPlay />
                            </div>
                            <div className="bookmark-icon">
                                <MdOutlineBookmarkAdd />
                            </div>
                        </div>
                        <div className="info-container">
                            <div className="movie-title-hover">{movieShowOn.movieTitle}</div>
                            <div className="info-details">
                                <span className="rating"><IoMdStar/>9.5</span>
                                    {movieShowOn.releaseDate &&
                                        (
                                            <>
                                                <span className="info-details-break"> | </span>
                                                <span className="movie-release-date">{dayjs(movieShowOn.releaseDate).format("YYYY")}</span>
                                            </>
                                        )
                                    }
                                    {movieShowOn.numberOfChild > 0 &&
                                        (
                                            <>
                                                <span className="info-details-break"> | </span>
                                                <span className="movie-eps">{movieShowOn.numberOfChild} eps</span>
                                            </>
                                        )
                                    }
                            </div>
                            <div className="movie-card-category">
                                {["anime", "fake"].map((tag, index) => (
                                    <span key={index} className="movie-tag">
                                    {tag}
                                </span>
                                ))}
                            </div>
                            <p className="description">{movieShowOn.description}</p>
                            <Link to="" className="more-info">More info {">"}</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;