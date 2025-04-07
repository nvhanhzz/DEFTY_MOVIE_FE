import {getWithParams} from "../utils/getWithParams.tsx";
import handleRequest from "../utils/handleRequest.tsx";
import {del, get, patchFormData, patchJson, postFormData} from "../utils/request.tsx";
import React from "react";

const PREFIX_ACTOR: string = import.meta.env.VITE_PREFIX_ACTOR as string;

export const getActors = async (
    page?: number,
    size?: number,
    filters?: Record<string, string | number>
): Promise<Response> => {
    const url = `${PREFIX_ACTOR}/all`;
    const params = {
        page,
        size,
        ...filters,
    };
    return handleRequest(getWithParams(url, params));
};

export const postActor = (option: FormData): Promise<Response> => {
    const url = `${PREFIX_ACTOR}`;
    return handleRequest(postFormData(url, option));
};

export const deleteActors = (ids: React.Key[]): Promise<Response> => {
    const url = `${PREFIX_ACTOR}/${ids.join(',')}`;
    return handleRequest(del(url));
};

export const getActorById = (id: string): Promise<Response> => {
    const url = `${PREFIX_ACTOR}/${id}`;
    return handleRequest(get(url));
};

export const updateActorById = (id: string, option: FormData): Promise<Response> => {
    const url = `${PREFIX_ACTOR}/${id}`;
    return handleRequest(patchFormData(url, option));
};

export const switchStatusActor = (id: string): Promise<Response> => {
    return handleRequest(patchJson(`${PREFIX_ACTOR}/status/${id}`, {}));
};