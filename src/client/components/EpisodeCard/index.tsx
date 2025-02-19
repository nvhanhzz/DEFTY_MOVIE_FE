import React from "react";
import { IoMdPlayCircle } from "react-icons/io";
import "./EpisodeCard.scss";

export interface Episode {
    thumbnail: string;
    number: number;
    title: string;
}

const EpisodeCard: React.FC<Episode> = ({thumbnail, number, title}) => {
    return (
        <div className="episode-card">
            <img src={thumbnail} alt="thumbnail"/>
            <span className="episode-number">{title} Episode {number}</span>
            <div className="play-icon">
                <IoMdPlayCircle />
            </div>
        </div>
    )
}

export default EpisodeCard;