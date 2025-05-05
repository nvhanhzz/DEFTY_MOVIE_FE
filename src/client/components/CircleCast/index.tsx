import React from "react";
import "./CircleCast.scss";
import {Link} from "react-router-dom";

const PREFIX_URL_CAST: string = import.meta.env.VITE_PREFIX_URL_CAST as string;
const PREFIX_URL_DIRECTOR: string = import.meta.env.VITE_PREFIX_URL_DIRECTOR as string;

// Unified Person type with name, slug, avatar, and type
export type Person = {
    name: string;
    slug: string;
    avatar: string;  // Avatar image URL (can be for both Actor and Director)
    type: "actor" | "director";  // This field indicates whether the person is an actor or director
};

type CircleCastProps = {
    person: Person;  // Accepts a unified `person` object
};

const CircleCast: React.FC<CircleCastProps> = ({ person }) => {
    const { name, avatar, type, slug } = person;

    const title = type === "actor" ? "Actor" : "Director";
    const linkTo = type === "actor" ? `/${PREFIX_URL_CAST}/${slug}` : `/${PREFIX_URL_DIRECTOR}/${slug}`;

    return (
        <Link to={linkTo} className="circle-cast">
            <div className="circle-cast__image-container">
                <img className="circle-cast__image" src={avatar} alt={name} />
            </div>
            <div className="circle-cast__info">
                <p className="circle-cast__name" title={name}>{name}</p>
                <p className="circle-cast__title">{title}</p>
            </div>
        </Link>
    );
};

export default CircleCast;