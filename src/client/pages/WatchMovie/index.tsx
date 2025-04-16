import React, {useEffect, useState} from "react";
import "./WatchMovie.scss";
import MovieInformation from "./MovieInformation";
import PlayVideo from "./PlayVideo";
import Related from "./Related";
import Recommended from "./Recommended";
import Comments from "./Comments";
import {useParams} from "react-router-dom";
import {getEpisodeBySlug, getEpisodesByMovie, getMovieInfoByEpisodeSlug} from "../../services/episodeService.tsx";
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
    const [isListEpisodeLoading, setIsListEpisodeLoading] = useState<boolean>(false);
    const [isMovieInfoLoading, setIsMovieInfoLoading] = useState<boolean>(false);
    const [episode, setEpisode] = useState<Episode | null>(null);
    const [listEpisode, setListEpisode] = useState<Episode[]>([]);
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
                setMovieInfo(result);
            } catch (error) {
                console.log(error);
                message.error(t('client.message.fetchError'));
            } finally {
                setIsMovieInfoLoading(false);
            }
        }

        // const fetchListEpisode = async (page: number) => {
        //     setIsListEpisodeLoading(true);
        //     try {
        //         const maxEpisodesPerGroup = 24;
        //
        //         const response = await getEpisodesByMovie(episodeSlug as string, page, maxEpisodesPerGroup);
        //         const result = await response.json();
        //         if (!response.ok || result.status === 404) {
        //             return;
        //         }
        //
        //         const eps: Episode[] = result.data.content.map((ep: Episode) => ({
        //             ...ep
        //         }));
        //
        //         const totalEpisodes = result.data.totalElements;
        //
        //         const episodeOptions = [];
        //         for (let i = 0; i < totalEpisodes; i += maxEpisodesPerGroup) {
        //             const start = i + 1;
        //             const end = Math.min(i + maxEpisodesPerGroup, totalEpisodes);
        //             episodeOptions.push(`${start}-${end}`);
        //         }
        //
        //         setEpisodeOptions(episodeOptions);
        //     } catch (error) {
        //         console.log(error);
        //         message.error(t('client.message.fetchError'));
        //     } finally {
        //         setIsListEpisodeLoading(false);
        //     }
        // }

        fetchEpisode();
        // fetchListEpisode(1);
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

                    {!showEpisodesBottom && (
                        <div className="watch-movie-main-block__related_play">
                            <Related />
                        </div>
                    )}
                </div>

                <div className="watch-movie-bottom-block">
                    <div className="watch-movie-information-container">
                        <div className="watch-movie-information-container__left">
                            <MovieInformation />
                        </div>

                        {showEpisodesBottom && (
                            <div className="watch-movie-information-container__middle">
                                <Related />
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
                        <Comments />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WatchMovie;