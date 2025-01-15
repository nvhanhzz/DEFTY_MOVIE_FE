import React from 'react';
import MovieCard, {Movie} from "../../components/MovieCard";
import "./ListMovieCard.scss";

interface ListMovieCardProps {
    listTitle: string;
    movies: Movie[];
}

const ListMovieCard: React.FC<ListMovieCardProps> = ({listTitle, movies}) => {
    return (
        <div className="list-movie-card">
            <h2 className="list-movie-card__title">{listTitle}</h2>
            <div className="list-movie-card-child">
                {movies.map((movie) => (
                    <MovieCard {...movie} />
                ))}
            </div>
        </div>
    );
};

export default ListMovieCard;
