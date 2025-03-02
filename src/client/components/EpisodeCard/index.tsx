import React from "react";
import { IoMdPlayCircle } from "react-icons/io";
import "./EpisodeCard.scss";

export interface Episode {
    id: number,
    number: number,
    description: string,
    thumbnail: string,
    link: string,
    movieId: number,
    status: number,
    movieTitle: string
}

const EpisodeCard: React.FC<Episode> = ({thumbnail, number, movieTitle}) => {
    return (
        <div className="episode-card">
            <img src={thumbnail} alt="thumbnail"/>
            <span className="episode-number">{movieTitle} Episode {number}</span>
            <div className="play-icon">
                <IoMdPlayCircle />
            </div>
        </div>
    )
}

export default EpisodeCard;