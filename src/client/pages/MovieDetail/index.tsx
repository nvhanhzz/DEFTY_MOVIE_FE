import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import MovieInformation from "./MovieInformation";
import {Episode} from "./EpisodeCard";
import ListEpisode from "./ListEpisode";
import {message, Spin} from "antd";
import {useTranslation} from "react-i18next";
import {getCastsByMovie, getMovieBySlug} from "../../services/movieService.tsx";
import {LoadingOutlined} from "@ant-design/icons";
import "./MovieDetail.scss";
import {getEpisodesByMovie} from "../../services/episodeService.tsx";
import SelectCustom from "../../components/SelectCustom";
import {Cast} from "./CastCard";
import ListCast from "./ListCast";

export interface MovieDetailProps {
    title: string;
    rating: number;
    releaseDate: Date;
    duration: string;
    description: string;
    coverImage: string;
    trailer: string;
    slug: string;
    firstEpisodeSlug: string;
    category: {
        name: string;
        slug: string;
    }[];
    director: {
        name: string;
        slug: string;
        thumbnail: string;
    };
    actor: {
        name: string;
        slug: string;
        avatar: string;
    }[];
}

const MovieDetail: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const { t } = useTranslation();
    const [isMovieDetailLoading, setIsMovieDetailLoading] = useState<boolean>(false);
    const [isEpisodesLoading, setIsEpisodesLoading] = useState<boolean>(false);
    const [isCastsLoading, setIsCastsLoading] = useState<boolean>(false);
    const [movie, setMovie] = useState<MovieDetailProps | null>(null);
    const [selectedTab, setSelectedTab] = useState<string>("Episodes");
    const [navContents, setNavContents] = useState<Episode[] | Cast[]>([]);
    const [episodeOptions, setEpisodeOptions] = useState<string[]>([]);
    const [selectedOption, setSelectedOption] = useState<number>(0);

    const fetchMovieDetail = async () => {
        setIsMovieDetailLoading(true);
        try {
            const response = await getMovieBySlug(slug as string);
            const result = await response.json();
            if (!response.ok || result.status === 404) {
                return;
            }
            setMovie({...result.data, slug: slug as string});
        } catch (error) {
            console.log(error);
            message.error(t('client.message.fetchError'));
        } finally {
            setIsMovieDetailLoading(false);
        }
    }

    const fetchEpisodes = async (page: number) => {
        setIsEpisodesLoading(true);
        try {
            const maxEpisodesPerGroup = 24;

            const response = await getEpisodesByMovie(slug as string, page, maxEpisodesPerGroup);
            const result = await response.json();
            if (!response.ok || result.status === 404) {
                return;
            }

            const eps: Episode[] = result.data.content.map((ep: Episode) => ({
                ...ep,
                movieSlug: slug as string,
                movieTitle: movie?.title
            }));
            setNavContents(eps);

            const totalEpisodes = result.data.totalElements;

            const episodeOptions = [];
            for (let i = 0; i < totalEpisodes; i += maxEpisodesPerGroup) {
                const start = i + 1;
                const end = Math.min(i + maxEpisodesPerGroup, totalEpisodes);
                episodeOptions.push(`${start}-${end}`);
            }

            setEpisodeOptions(episodeOptions);
        } catch (error) {
            console.log(error);
            message.error(t('client.message.fetchError'));
        } finally {
            setIsEpisodesLoading(false);
        }
    }

    const handleChooseListEpisodes = async (page: number) => {
        setSelectedOption(page);
        fetchEpisodes(page + 1);
    }

    const fetchCasts = async () => {
        setIsCastsLoading(true);
        try {
            const response = await getCastsByMovie(slug as string);
            const result = await response.json();
            if (!response.ok || result.status === 404) {
                return;
            }
            const castsResponse: Cast[] = [];
            if (result.data.directorResponse) {
                castsResponse.push({
                    ...result.data.directorNameResponse,
                    type: 'Director',
                });
            }
            for (const actor of result.data.actors) {
                castsResponse.push({
                    ...actor,
                    type: 'Actor',
                });
            }

            setNavContents(castsResponse);
        } catch (error) {
            console.log(error);
            message.error(t('client.message.fetchError'));
        } finally {
            setIsCastsLoading(false);
      }
    }

    useEffect(() => {
        fetchMovieDetail();
    }, []);

    useEffect(() => {
        switch (selectedTab) {
            case "Episodes":
                fetchEpisodes(1);
                break;
            case "Cast":
                fetchCasts();
                break;
            default:
                break;
        }
    }, [selectedTab]);

    return (
        <div className="movie-detail">
            {
                isMovieDetailLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '75vh' }}>
                        <Spin indicator={<LoadingOutlined spin />} />
                    </div>
                ) : (
                    <MovieInformation {...movie as MovieDetailProps} />
                )
            }
            <div className="movie-detail-middle">
                <div className="movie-detail-middle-navs">
                    {["Episodes", "Cast", "Collections", "Recommended"].map((tab) => (
                        <div
                            key={tab}
                            className={`nav ${selectedTab === tab ? "nav-choose" : ""}`}
                            onClick={() => setSelectedTab(tab)}
                        >
                            {tab}
                        </div>
                    ))}
                </div>
                <hr className="movie-detail-middle-divider" />
                {
                    selectedTab === "Episodes" && (
                        <SelectCustom
                            options={episodeOptions}
                            selectedIndex={selectedOption}
                            onSelect={(index: number) => handleChooseListEpisodes(index)}
                        />
                    )
                }
            </div>
            {selectedTab === "Episodes" && (
                isEpisodesLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '75vh' }}>
                        <Spin indicator={<LoadingOutlined spin />} />
                    </div>
                ) : (
                    <ListEpisode episodes={navContents as Episode[]} />
                )
            )}
            {selectedTab === "Cast" && (
                isCastsLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '75vh' }}>
                        <Spin indicator={<LoadingOutlined spin />} />
                    </div>
                ) : (
                    <ListCast casts={navContents as Cast[]} />
                )
            )}
        </div>
    );
}

export default MovieDetail;