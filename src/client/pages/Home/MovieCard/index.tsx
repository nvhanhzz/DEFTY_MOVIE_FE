import React from "react";
import "./MovieCard.scss";
import {FaCirclePlay} from "react-icons/fa6";
import {MdOutlineBookmarkAdd} from "react-icons/md";
import {Link, useNavigate} from "react-router-dom";

export interface Movie {
    title: string; // Tên phim,
    badge: string[];
    category: string[]; // Danh mục thể loại
    rating: number; // Đánh giá phim
    releaseDate: string; // Ngày phát hành
    description: string; // Mô tả phim
    thumbnail: string; // URL ảnh nền
}

const MovieCard: React.FC<Movie> = ({
                                        title,
                                        category,
                                        rating,
                                        releaseDate,
                                        description,
                                        thumbnail,
                                    }) => {
    const navigate = useNavigate();

    const handleNavigateDetail = () => {
        navigate("/album/one-piece");
    }

    return (
        <div className="movie-card" onClick = {handleNavigateDetail}>
            <div className="info">
                <img src={thumbnail} alt="thumbnail"/>
                <div className="top-badge">Badge</div>
                <h4>{title}</h4>
            </div>
            <div className="info-hover">
            <div className="top-badge">Badge</div>
                <div className="hover-info">
                    <img src={thumbnail} alt="thumbnail"/>
                    <div className="movie-card-buttons">
                        <FaCirclePlay className="play-icon"/>
                        <MdOutlineBookmarkAdd className="bookmark-icon"/>
                    </div>
                    <div className="info-container">
                        <h3>{title}</h3>
                        <p className="rating">⭐ {rating}</p>
                        <div className="movie-card-category">
                            {category.map((tag, index) => (
                                <span key={index} className="movie-tag">
                                {tag}
                            </span>
                            ))}
                        </div>
                        <p>{releaseDate}</p>
                        <p className="description">{description}</p>
                        <Link to="" className="more-info">More info {">"}</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;