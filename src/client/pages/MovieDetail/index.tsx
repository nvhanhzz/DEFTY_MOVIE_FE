import React from "react";
import MovieInformation from "../../components/MovieInformation";
import {Movie} from "../../components/MovieCard";
import {Episode} from "../../components/EpisodeCard";
import ListEpisode from "../../components/ListEpisode";
import "./MovieDetail.scss";

const MovieDetail: React.FC = () => {
    const movie: Movie = {
        title: "One Piece",
        badge: ["Top 1", "Hot anime"],
        category: ["Anime", "Japan", "Japanese", "Fantasy"],
        rating: 9.5,
        releaseDate: "1999",
        description: "Subtitle available on Sunday 4PM（GMT+8）.",
        thumbnail: "http://pic0.iqiyipic.com/image/20240618/f2/2e/a_100421840_m_601_en_m6_1013_569.jpg",
    }

    const episodes: Episode[] = [
    ]

    for (let i = 0; i < 24; i++) {
        episodes.push( {
            title: movie.title,
            thumbnail: "https://danviet.mediacdn.vn/296231569849192448/2023/6/18/one-piece-header2000x1270-1687049323660685039990.jpg",
            number: 889
        });
    }

    return (
        <div className="movie-detail">
            <MovieInformation {...movie} />
            <ListEpisode episodes={episodes} />
        </div>
    );
}

export default MovieDetail;