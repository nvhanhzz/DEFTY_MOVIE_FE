import React from "react";
import EpisodeCard, {Episode} from "../EpisodeCard";
import "./ListEpisode.scss";

interface EpisodeProps {
    episodes: Episode[];
}

const ListEpisode: React.FC<EpisodeProps> = ({episodes}) => {
    return (
        <div className="list-episode">
            {episodes.map((episode, index) => (
                <EpisodeCard {...episode} key={index} />
            ))}
        </div>
    );
}

export default ListEpisode;