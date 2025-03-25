// import {getWithParams} from "../utils/getWithParams.tsx";
import handleRequest from "../utils/handleRequest.tsx";
import {del, get, patchFormData, patchStatus, postFormData} from "../utils/request.tsx";
import React from "react";
import {getWithParams} from "../utils/getWithParams.tsx";

const PREFIX_MOVIE: string = import.meta.env.VITE_PREFIX_MOVIE as string;

export const getMovies = async (
    page?: number,
    size?: number,
    filters?: Record<string, string | number>
): Promise<Response> => {
    const url = `${PREFIX_MOVIE}`;
    const params = {
        page,
        size,
        ...filters,
    };
    return handleRequest(getWithParams(url, params));
};

export const switchStatusMovie  = (id: string): Promise<Response> => {
    return handleRequest(patchStatus(`${PREFIX_MOVIE}/status/${id}`));
};

export const postMovie = (option: FormData): Promise<Response> => {
    const url = `${PREFIX_MOVIE}`;
    return handleRequest(postFormData(url, option));
};

export const deleteMovie = (ids: React.Key[]): Promise<Response> => {
    const url = `${PREFIX_MOVIE}/${ids.join(',')}`;
    return handleRequest(del(url));
};

export const getMovieById = (id: string): Promise<Response> => {
    const url = `${PREFIX_MOVIE}/${id}`;
    return handleRequest(get(url));
};

export const updateMovieById = (id: string, option: FormData): Promise<Response> => {
    const url = `${PREFIX_MOVIE}/${id}`;
    return handleRequest(patchFormData(url, option));
};