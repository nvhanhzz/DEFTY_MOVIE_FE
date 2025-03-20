import handleRequest from "../utils/handleRequest.tsx";
import {getWithParams} from "../utils/getWithParams.tsx";

const PREFIX_CLIENT_MOVIE_DETAIL: string = import.meta.env.VITE_PREFIX_CLIENT_MOVIE_DETAIL as string;
const PREFIX_CLIENT_EPISODE: string = import.meta.env.VITE_PREFIX_CLIENT_EPISODE as string;

export const getEpisodesByMovie = async (
    slugMovie?: string
): Promise<Response> => {
    const url = `${PREFIX_CLIENT_MOVIE_DETAIL}/${PREFIX_CLIENT_EPISODE}`;
    const params = {
        slugMovie
    };
    return handleRequest(getWithParams(url, params));
};