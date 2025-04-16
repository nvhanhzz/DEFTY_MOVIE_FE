import handleRequest from "../utils/handleRequest.tsx";
import {getWithParams} from "../utils/getWithParams.tsx";

const PREFIX_CLIENT_EPISODE: string = import.meta.env.VITE_PREFIX_CLIENT_EPISODE as string;
const PREFIX_CLIENT_ACCESSIBLE: string = import.meta.env.VITE_PREFIX_CLIENT_ACCESSIBLE as string;
const PREFIX_CLIENT_MOVIE: string = import.meta.env.VITE_PREFIX_CLIENT_MOVIE as string;

export const getEpisodesByMovie = async (
    slugMovie?: string,
    page: number = 1,
    size: number = 24
): Promise<Response> => {
    const url = `${PREFIX_CLIENT_ACCESSIBLE}/${PREFIX_CLIENT_MOVIE}/${PREFIX_CLIENT_EPISODE}`;
    const params = {
        slugMovie,
        page,
        size,
    };
    return handleRequest(getWithParams(url, params));
};

export const getEpisodeBySlug = async (
    slug: string,
): Promise<Response> => {
    const url = `${PREFIX_CLIENT_ACCESSIBLE}/${PREFIX_CLIENT_EPISODE}/video`;
    const params = {
        slug
    };
    return handleRequest(getWithParams(url, params));
};

export const getListEpisodeByEpisodeSlug = async (
    slug: string,
    page: number = 1,
    size: number = 24
): Promise<Response> => {
    const url = `${PREFIX_CLIENT_ACCESSIBLE}/${PREFIX_CLIENT_EPISODE}/list`;
    const params = {
        slug,
        page,
        size,
    };
    return handleRequest(getWithParams(url, params));
};

export const getMovieInfoByEpisodeSlug = async (
    slug: string,
): Promise<Response> => {
    const url = `${PREFIX_CLIENT_ACCESSIBLE}/${PREFIX_CLIENT_EPISODE}`;
    const params = {
        slug
    };
    return handleRequest(getWithParams(url, params));
};