import React from "react";
import "./ListCast.scss";
import CastCard, {Cast} from "../CastCard";

interface CastsProps {
    casts: Cast[];
}

const ListEpisode: React.FC<CastsProps> = ({casts}) => {
    return (
        <div className="list-cast">
            {casts.map((cast: Cast, index: number) => (
                <CastCard {...cast} key={index} />
            ))}
        </div>
    );
}

export default ListEpisode;