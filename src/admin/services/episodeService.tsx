import {getWithParams} from "../utils/getWithParams.tsx";
import handleRequest from "../utils/handleRequest.tsx";
import {del, get, patchFormData, postFormData} from "../utils/request.tsx";
import React from "react";

const PREFIX_EPISODE: string = import.meta.env.VITE_PREFIX_EPISODE as string;

export const getEpisodesByMovie = async (
    movieId: string,
    page: number,
    size: number
): Promise<Response> => {
    const url = `${PREFIX_EPISODE}`;
    const params = { page, size, movieId };
    return handleRequest(getWithParams(url, params));
};

export const postEpisode = (option: FormData): Promise<Response> => {
    const url = `${PREFIX_EPISODE}`;
    return handleRequest(postFormData(url, option));
};

export const deleteEpisodes = (ids: React.Key[]): Promise<Response> => {
    const url = `${PREFIX_EPISODE}/${ids.join(',')}`;
    return handleRequest(del(url));
};

export const getEpisodeById = (id: string): Promise<Response> => {
    const url = `${PREFIX_EPISODE}/${id}`;
    return handleRequest(get(url));
};

export const updateEpisodeById = (id: string, option: FormData): Promise<Response> => {
    const url = `${PREFIX_EPISODE}/${id}`;
    return handleRequest(patchFormData(url, option));
};