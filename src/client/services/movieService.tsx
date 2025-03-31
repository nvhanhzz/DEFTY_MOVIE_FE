import handleRequest from "../utils/handleRequest.tsx";
import {getWithParams} from "../utils/getWithParams.tsx";

const PREFIX_CLIENT_MOVIE_DETAIL: string = import.meta.env.VITE_PREFIX_CLIENT_MOVIE_DETAIL as string;
const PREFIX_CLIENT_ACTOR: string = import.meta.env.VITE_PREFIX_CLIENT_ACTOR as string;
const PREFIX_CLIENT_ACCESSIBLE: string = import.meta.env.VITE_PREFIX_CLIENT_ACCESSIBLE as string;
const PREFIX_CLIENT_MOVIE_SEARCH: string = import.meta.env.VITE_PREFIX_CLIENT_MOVIE_SEARCH as string;
const PREFIX_CLIENT_MOVIE: string = import.meta.env.VITE_PREFIX_CLIENT_MOVIE as string;

export const getMovieBySlug = async (
    slugMovie?: string
): Promise<Response> => {
    const url = `${PREFIX_CLIENT_ACCESSIBLE + "/" + PREFIX_CLIENT_MOVIE_DETAIL}`;
    const params = {
        slugMovie
    };
    return handleRequest(getWithParams(url, params));
}

export const getCastsByMovie = async (slugMovie?: string): Promise<Response> => {
    const url = `${PREFIX_CLIENT_ACCESSIBLE + "/" + PREFIX_CLIENT_MOVIE_DETAIL + "/" + PREFIX_CLIENT_ACTOR}`;
    const params = {
        slugMovie
    };
    return handleRequest(getWithParams(url, params));
}

export const searchMovie = async (title: string): Promise<Response> => {
    const url = `${PREFIX_CLIENT_ACCESSIBLE + "/" + PREFIX_CLIENT_MOVIE + "/" + PREFIX_CLIENT_MOVIE_SEARCH}`;
    const params = {
        title
    };
    return handleRequest(getWithParams(url, params));
}