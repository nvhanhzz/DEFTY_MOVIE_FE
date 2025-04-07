import React, {useEffect, useState} from "react";
import {message, Spin} from "antd";
import {useTranslation} from "react-i18next";
import {getSearchMovieResult} from "../../../services/movieService.tsx";
import {useLocation} from "react-router-dom";
import {LoadingOutlined} from "@ant-design/icons";
import MovieInfo from "../MovieInfo";

interface Actor {
    name: string;
    slug: string | null;
}

export interface Episode {
    number: number;
    slug: string | null;
}

interface Director {
    name: string;
    slug: string | null;
}

export interface Movie {
    id: number,
    title: string,
    description: string,
    thumbnail: string,
    status: number,
    releaseDate: string,
    membershipType: string | null,
    slug: string,
    director: Director,
    actors: Actor[],
    episodes: Episode[],
    movie?: Movie
}

const ListMovie: React.FC = () => {
    const location = useLocation();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [result, setResult] = useState<Movie[] | null>(null);
    const {t} = useTranslation();

    const fetchSearchResult = async (key: string) => {
        setIsLoading(true);
        try {
            const response = await getSearchMovieResult(key);
            const resultData = await response.json();

            if (!response.ok || resultData.status === 404) {
                setResult(null);
                return;
            }

            setResult(resultData.data);
        } catch (error) {
            console.log(error);
            message.error(t('client.message.fetchError'));
            setResult(null);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const newQuery = queryParams.get('query');

        if (newQuery) {
            fetchSearchResult(newQuery);
        }
    }, [location.search]);

    if (isLoading) {
        return (
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '75vh'}}>
                <Spin indicator={<LoadingOutlined spin/>}/>
            </div>
        );
    }

    return (
        <>
            {result?.map((movie: Movie, index: number) => (
                <MovieInfo keySearch={new URLSearchParams(location.search).get('query') as string} movie={movie} key={index}/>
            ))}
        </>
    )
};

export default ListMovie;