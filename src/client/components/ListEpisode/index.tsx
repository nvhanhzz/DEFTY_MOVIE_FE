import React from "react";
import EpisodeCard, {Episode} from "../EpisodeCard";
import "./ListEpisode.scss";

interface episodeProps {
    episodes: Episode[];
}

const ListEpisode: React.FC<episodeProps> = ({episodes}) => {
    return (
        <div className="list-episode">
            {episodes.map((episode, index) => (
                <EpisodeCard {...episode} key={index} />
            ))}
        </div>
    );
}

export default ListEpisode;