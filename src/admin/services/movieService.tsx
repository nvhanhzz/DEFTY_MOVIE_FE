// import {getWithParams} from "../utils/getWithParams.tsx";
import handleRequest from "../utils/handleRequest.tsx";
import {del, get, patchFormData, postFormData} from "../utils/request.tsx";
import React from "react";

const PREFIX_MOVIE: string = import.meta.env.VITE_PREFIX_MOVIE as string;

// export const getMovie = async (page?: number, size?: number, searchKey?: string, searchValue?: string): Promise<Response> => {
//     const url = `${PREFIX_MOVIE}s`;
//     const params = { page, size, [searchKey || '']: searchValue };
//     return handleRequest(getWithParams(url, params));
// };

export const getMovie = async (): Promise<Response> => {
    const url = `${PREFIX_MOVIE}`;
    return handleRequest(get(url));
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