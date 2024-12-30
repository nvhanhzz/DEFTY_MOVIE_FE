import {getWithParams} from "../utils/getWithParams.tsx";
import handleRequest from "../utils/handleRequest.tsx";
import {del, get, patchFormData, postFormData} from "../utils/request.tsx";
import React from "react";

const PREFIX_DIRECTOR: string = import.meta.env.VITE_PREFIX_DIRECTOR as string;

export const getDirectors = async (
    page?: number,
    size?: number,
    filters?: Record<string, string | number>
): Promise<Response> => {
    const url = `${PREFIX_DIRECTOR}/all`;
    const params = {
        page,
        size,
        ...filters,
    };
    return handleRequest(getWithParams(url, params));
};

export const postDirector = (option: FormData): Promise<Response> => {
    const url = `${PREFIX_DIRECTOR}`;
    return handleRequest(postFormData(url, option));
};

export const deleteDirectors = (ids: React.Key[]): Promise<Response> => {
    const url = `${PREFIX_DIRECTOR}/${ids.join(',')}`;
    return handleRequest(del(url));
};

export const getDirectorById = (id: string): Promise<Response> => {
    const url = `${PREFIX_DIRECTOR}/${id}`;
    return handleRequest(get(url));
};

export const updateDirectorById = (id: string, option: FormData): Promise<Response> => {
    const url = `${PREFIX_DIRECTOR}/${id}`;
    return handleRequest(patchFormData(url, option));
};