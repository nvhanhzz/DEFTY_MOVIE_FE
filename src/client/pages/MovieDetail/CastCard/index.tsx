import React from "react";
import {Link, useNavigate} from "react-router-dom";
import "./CastCard.scss";
import { FaPlay } from "react-icons/fa";
import { MdOutlineBookmarkAdd } from "react-icons/md";

const PREFIX_URL_CAST = import.meta.env.VITE_PREFIX_URL_CAST as string;
const PREFIX_URL_DIRECTOR = import.meta.env.VITE_PREFIX_URL_DIRECTOR as string;

export interface Cast {
    type: 'Actor' | 'Director';
    fullName: string;
    avatar: string;
    slug: string;
    movies: {
        title: string;
        thumbnail: string;
        slug: string;
    }[];
}

const CastCard: React.FC<Cast> = ({ fullName, avatar, type, slug, movies }) => {
    const navigate = useNavigate();
    const handleClickCast = () => {
        switch (type) {
            case 'Actor':
                navigate(`/${PREFIX_URL_CAST}/${slug}`);
                break;
            case 'Director':
                navigate(`/${PREFIX_URL_DIRECTOR}/${slug}`);
                break;
            default:
                break;
        }
    }

    return (
        <div className="cast-card">
            <div className="cast-card-header" onClick={() => {handleClickCast()}}>
                <img src={avatar} alt={fullName} className="cast-avatar" />
                <div className="cast-info">
                    <h3 className="cast-name">{fullName}</h3>
                    <div className="cast-info-bottom">
                        <p className="cast-type">{type}</p>
                        <span className="more-link">More ➜</span>
                    </div>
                </div>
            </div>
            <div className="cast-movie-list">
                {movies && movies.map((m) => (
                    <Link to={`/movie/${m.slug}`} key={m.slug} className="movie-item">
                        <div className="movie-thumbnail">
                            <img src={m.thumbnail || "http://pic8.iqiyipic.com/image/20250227/05/8b/a_100607538_m_601_en_260_360.webp"} alt={m.title} />
                            <div className="bottom-layer"></div>
                            <span className={`movie-tag`}>Defty Only</span>
                            <button className="movie-thumbnail-play-button">
                                <FaPlay />
                            </button>
                            <button className="movie-thumbnail-bookmark-button">
                                <MdOutlineBookmarkAdd />
                            </button>
                        </div>
                        <p className="movie-title">{m.title}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CastCard;