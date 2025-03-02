import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import MovieInformation from "../../components/MovieInformation";
import {Episode} from "../../components/EpisodeCard";
import ListEpisode from "../../components/ListEpisode";
import {message, Spin} from "antd";
import {useTranslation} from "react-i18next";
import {getMovieBySlug} from "../../services/movieService.tsx";
import {LoadingOutlined} from "@ant-design/icons";
import "./MovieDetail.scss";

export interface MovieDetailProps {
    title: string;
    rating: number;
    releaseDate: Date;
    duration: string;
    description: string;
    image: string;
    trailer: string;
    director: string;
    category: string[];
    actor: string[];
}

const MovieDetail: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [movie, setMovie] = useState<MovieDetailProps | null>(null);

    const fetchMovieDetail = async () => {
        setIsLoading(true);
        try {
            const response = await getMovieBySlug(slug as string);
            const result = await response.json();
            if (!response.ok || result.status === 404) {
                return;
            }

            setMovie(result.data);
        } catch (error) {
            console.log(error);
            message.error(t('client.message.fetchError'));
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchMovieDetail();
    }, [])

    const episodes: Episode[] = [
    ]

    // for (let i = 0; i < 24; i++) {
    //     episodes.push( {
    //         title: movie.title,
    //         thumbnail: "https://danviet.mediacdn.vn/296231569849192448/2023/6/18/one-piece-header2000x1270-1687049323660685039990.jpg",
    //         number: 889
    //     });
    // }

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '75vh' }}>
                <Spin indicator={<LoadingOutlined spin />} />
            </div>
        )
    }

    return (
        <div className="movie-detail">
            <MovieInformation {...movie as MovieDetailProps} />
            <ListEpisode episodes={episodes} />
        </div>
    );
}

export default MovieDetail;