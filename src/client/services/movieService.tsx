import handleRequest from "../utils/handleRequest.tsx";
import {getWithParams} from "../utils/getWithParams.tsx";

const PREFIX_CLIENT_MOVIE_DETAIL: string = import.meta.env.VITE_PREFIX_CLIENT_MOVIE_DETAIL as string;

export const getMovieBySlug = async (
    slugMovie?: string
): Promise<Response> => {
    const url = `${PREFIX_CLIENT_MOVIE_DETAIL}`;
    const params = {
        slugMovie
    };
    return handleRequest(getWithParams(url, params));
};