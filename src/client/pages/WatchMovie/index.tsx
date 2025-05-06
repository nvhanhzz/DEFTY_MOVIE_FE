import React, {useEffect, useState} from "react";
import "./WatchMovie.scss";
import MovieInformation from "./MovieInformation";
import PlayVideo from "./PlayVideo";
import Related from "./Related";
import Recommended from "./Recommended";
import Comments from "./Comments";
import {useParams} from "react-router-dom";
import {getEpisodeBySlug, getMovieInfoByEpisodeSlug} from "../../services/episodeService.tsx";
import {message, Spin} from "antd";
import {useTranslation} from "react-i18next";
import {MovieDetailProps} from "../MovieDetail";
import {LoadingOutlined} from "@ant-design/icons";

export interface Episode {
    id: number;
    number: number;
    description: string | null;
    thumbnail: string;
    link: string;
    slug: string;
    movieId: number | null;
    status: number;
}

const WatchMovie: React.FC = () => {
    const { episodeSlug } = useParams<{ episodeSlug: string }>();
    const { t } = useTranslation();
    const [isEpisodeLoading, setIsEpisodeLoading] = useState<boolean>(false);
    const [isMovieInfoLoading, setIsMovieInfoLoading] = useState<boolean>(false);
    const [episode, setEpisode] = useState<Episode | null>(null);
    const [movieInfo, setMovieInfo] = useState<MovieDetailProps | null>(null);
    const [showEpisodesBottom, setShowEpisodesBottom] = useState<boolean>(false);

    const updateVisibleListEpisode = () => {
        const width = window.innerWidth;
        if(width < 1024) {
            setShowEpisodesBottom(true);
        } else {
            setShowEpisodesBottom(false);
        }
    };

    useEffect(() => {
        updateVisibleListEpisode();
        window.addEventListener('resize', updateVisibleListEpisode);

        return () => {
            window.removeEventListener('resize', updateVisibleListEpisode);
        };
    }, []);

    useEffect(() => {
        const fetchEpisode = async() => {
            setIsEpisodeLoading(true);
            try {
                const response = await getEpisodeBySlug(episodeSlug as string);
                const result = await response.json();
                if (!response.ok || result.status === 404) {
                    return;
                }
                setEpisode(result.data);
            } catch (error) {
                console.log(error);
                message.error(t('client.message.fetchError'));
            } finally {
                setIsEpisodeLoading(false);
            }
        }

        const fetchMovieInfo = async() => {
            setIsMovieInfoLoading(true);
            try {
                const response = await getMovieInfoByEpisodeSlug(episodeSlug as string);
                const result = await response.json();
                if (!response.ok || result.status === 404) {
                    return;
                }
                setMovieInfo(result.data);
            } catch (error) {
                console.log(error);
                message.error(t('client.message.fetchError'));
            } finally {
                setIsMovieInfoLoading(false);
            }
        }

        fetchEpisode();
        fetchMovieInfo();
    }, []);

    return (
        <div className="watch-movie-wrapper">
            <div className="watch-movie-container">
                <div className="watch-movie-main-block">

                    <div className="watch-movie-main-block__play">
                        {
                            isEpisodeLoading || !episode ? (
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                    <Spin indicator={<LoadingOutlined spin />} />
                                </div>
                            ) : (
                                <PlayVideo episode={episode} />
                            )
                        }

                    </div>

                    {!showEpisodesBottom && movieInfo && episode && (
                        <div className="watch-movie-main-block__related_play">
                            <Related movie={movieInfo} episode={episode} />
                        </div>
                    )}
                </div>

                <div className="watch-movie-bottom-block">
                    <div className="watch-movie-information-container">
                        <div className="watch-movie-information-container__left">
                            {!movieInfo || isMovieInfoLoading ? (
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                    <Spin indicator={<LoadingOutlined spin />} />
                                </div>
                            ) : (
                                <MovieInformation movieInfo={movieInfo} />
                            )}
                        </div>

                        {showEpisodesBottom && movieInfo && episode  && (
                            <div className="watch-movie-information-container__middle">
                                <Related movie={movieInfo} episode={episode} />
                            </div>
                        )}

                        <div className="watch-movie-information-container__right">
                            Right information (Ex: drama, movies ...)
                        </div>
                    </div>

                    <div className="watch-movie-recommended">
                        <Recommended />
                    </div>

                    <div className="watch-movie-comments">
                        <Comments episodeId={episode?.id as number} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WatchMovie;