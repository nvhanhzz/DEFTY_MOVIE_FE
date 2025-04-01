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
    category: {
        name: string;
        slug: string;
    }[];
    director: {
        name: string;
        slug: string;
    };
    actor: {
        name: string;
        slug: string;
    }[];
}

const MovieDetail: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [movie, setMovie] = useState<MovieDetailProps | null>(null);
    const [selectedTab, setSelectedTab] = useState<string>("Episodes");
    const [navContents, setNavContents] = useState<Episode[] | Cast[]>([]);

    const fetchMovieDetail = async () => {
        setIsLoading(true);
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
            setIsLoading(false);
        }
    }

    const fetchEpisodes = async () => {
        setIsLoading(true);
        try {
            const response = await getEpisodesByMovie(slug as string);
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
        } catch (error) {
            console.log(error);
            message.error(t('client.message.fetchError'));
        } finally {
            setIsLoading(false);
        }
    }

    const fetchCasts = async () => {
        setIsLoading(true);
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
            setIsLoading(false);
      }
    }

    useEffect(() => {
        fetchMovieDetail();
    }, []);

    useEffect(() => {
        switch (selectedTab) {
            case "Episodes":
                fetchEpisodes();
                break;
            case "Cast":
                fetchCasts();
                break;
            default:
                break;
        }
    }, [selectedTab]);

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '75vh' }}>
                <Spin indicator={<LoadingOutlined spin />} />
            </div>
        );
    }

    return (
        <div className="movie-detail">
            <MovieInformation {...movie as MovieDetailProps} />
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
                        <SelectCustom />
                    )
                }
            </div>
            {selectedTab === "Episodes" && <ListEpisode episodes={navContents as Episode[]} />}
            {selectedTab === "Cast" && <ListCast casts={navContents as Cast[]} />}
        </div>
    );
}

export default MovieDetail;