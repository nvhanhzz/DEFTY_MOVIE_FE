import React from "react";
import { FaPlay } from "react-icons/fa";
import "./EpisodeCard.scss";
import {useNavigate} from "react-router-dom";

export interface Episode {
    id: number,
    number: number,
    description: string,
    thumbnail: string,
    link: string,
    movieId: number,
    status: number,
    movieTitle: string,
    movieSlug: string
}

const PREFIX_URL_PLAY: string = import.meta.env.VITE_PREFIX_URL_PLAY as string;

const EpisodeCard: React.FC<Episode> = ({thumbnail, number, movieTitle, movieSlug}) => {
    const navigate = useNavigate();

    return (
        <div className="episode-card" onClick={() => navigate(`/${PREFIX_URL_PLAY}/${movieSlug}/${number}`)}>
            <img src={thumbnail} alt="thumbnail"/>
            <span className="episode-number">{movieTitle} Episode {number}</span>
            <div className="play-icon">
                <FaPlay />
            </div>
        </div>
    )
}

export default EpisodeCard;