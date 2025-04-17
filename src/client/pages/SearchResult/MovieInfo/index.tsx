import React, { useState, useEffect } from "react";
import {Episode, Movie} from "../ListMovie";
import {Link, useNavigate} from "react-router-dom";
import './MovieInfo.scss';
import dayjs from "dayjs";
import { MdNavigateNext } from "react-icons/md";

const PREFIX_URL_ALBUM: string = import.meta.env.VITE_PREFIX_URL_ALBUM as string;
const PREFIX_URL_PLAY: string = import.meta.env.VITE_PREFIX_URL_PLAY as string;
const PREFIX_URL_CAST: string = import.meta.env.VITE_PREFIX_URL_CAST as string;
const PREFIX_URL_DIRECTOR: string = import.meta.env.VITE_PREFIX_URL_DIRECTOR as string;

interface MovieProps {
    movie: Movie;
    keySearch: string;
}

const MovieInfo: React.FC<MovieProps> = ({ movie, keySearch }) => {
    movie.episodes.sort((a: Episode, b: Episode) => a.number - b.number);
    const [visibleEpisodes, setVisibleEpisodes] = useState<number>(13);
    const [showYear, setShowYear] = useState<boolean>(true);
    const [showButtonWatch, setShowButtonWatch] = useState<boolean>(movie.episodes.length === 1);
    const navigate = useNavigate();

    const lowerTitle = movie.title.toLowerCase();
    const lowerKeySearch = keySearch.toLowerCase();

    const lastIndex = lowerTitle.lastIndexOf(lowerKeySearch);

    let titleBeforeMatch = '';
    let matchedPart = '';
    let titleAfterMatch = '';

    if (lastIndex !== -1) {
        const matchLength = keySearch.length;
        titleBeforeMatch = movie.title.slice(0, lastIndex);
        matchedPart = movie.title.slice(lastIndex, lastIndex + matchLength);
        titleAfterMatch = movie.title.slice(lastIndex + matchLength);
    } else {
        titleAfterMatch = movie.title;
    }

    const updateVisibleEpisodes = () => {
        const width = window.innerWidth;
        if (width < 768) {
            setVisibleEpisodes(4);
            setShowYear(false);
            setShowButtonWatch(true);
        } else if(width < 1024) {
            setVisibleEpisodes(6);
            setShowYear(true);
            setShowButtonWatch(movie.episodes.length === 1);
        } else {
            setVisibleEpisodes(12);
            setShowYear(true);
            setShowButtonWatch(movie.episodes.length === 1);
        }
    };

    useEffect(() => {
        updateVisibleEpisodes();
        window.addEventListener('resize', updateVisibleEpisodes);

        return () => {
            window.removeEventListener('resize', updateVisibleEpisodes);
        };
    }, []);

    const showEpisodes = movie.episodes.slice(0, visibleEpisodes);

    const remainingEpisodesCount = movie.episodes.length - visibleEpisodes;
    const showEllipsis = remainingEpisodesCount > 0;

    return (
        <div className="movie-info">
            <Link to={`/${PREFIX_URL_ALBUM}/${movie.slug}`} className="movie-info__thumbnail">
                <img src={movie.thumbnail} alt="movie-thumbnail" />
            </Link>

            <div className="movie-info__details">
                <Link to={`/${PREFIX_URL_ALBUM}/${movie.slug}`} className="movie-info__title">
                    <span className="movie-info__title--match">{titleBeforeMatch}{matchedPart}</span>
                    {titleAfterMatch}
                </Link>

                {movie.releaseDate  && showYear && (
                    <div className="movie-info__year">
                        <span className="label">Year: </span>
                        <span className="value">{dayjs(movie.releaseDate).format("YYYY")}</span>
                    </div>
                )}

                {movie.director && (
                    <div className="movie-info__director">
                        <span className="label">Director: </span>
                        <Link
                            key={movie.director.name}
                            to={`/${PREFIX_URL_DIRECTOR}/${movie.director.slug}`}
                            className="movie-info__director--name"
                        >
                            {movie.director.name}
                        </Link>
                    </div>
                )}

                {movie.actors.length > 0 && (
                    <div className="movie-info__cast">
                        <span className="label">Cast: </span>
                        {movie.actors.map((actor, index) => (
                            <Link
                                key={actor.name}
                                to={`/${PREFIX_URL_CAST}/${actor.slug}`}
                                className="movie-info__cast-member"
                            >
                                {actor.name}{index < movie.actors.length - 1 ? ", " : ""}
                            </Link>
                        ))}
                    </div>
                )}

                {
                    showButtonWatch && (
                        <button onClick={() => {navigate(`/${PREFIX_URL_PLAY}/${movie.episodes[0].slug}`)}} className="movie-info__watch-now">Watch now</button>
                    )
                }

                {
                    movie.episodes.length > 1 && (
                        <div className="movie-info__episodes">
                            {showEpisodes.map((episode) => (
                                <Link to={`/${PREFIX_URL_PLAY}/${episode.slug}`} key={episode.number} className="movie-info__episode">
                                    {episode.number}
                                </Link>
                            ))}

                            {showEllipsis && (
                                <Link to={`/${PREFIX_URL_ALBUM}/${movie.slug}`} className="movie-info__episode ellipsis">...</Link>
                            )}

                            {showEllipsis && (
                                <Link to={`/${PREFIX_URL_PLAY}/${movie.episodes[movie.episodes.length - 1].slug}`} className="movie-info__episode">
                                    {movie.episodes[movie.episodes.length - 1].number}
                                </Link>
                            )}
                        </div>
                    )
                }

                <Link to={`/${PREFIX_URL_ALBUM}/${movie.slug}`} className="movie-info__more">
                    More
                    <div className="movie-info__more--icon">
                        <MdNavigateNext />
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default MovieInfo;