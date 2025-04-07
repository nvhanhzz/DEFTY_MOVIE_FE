import {getWithParams} from "../utils/getWithParams.tsx";
import handleRequest from "../utils/handleRequest.tsx";
import {del, get, patchFormData, patchJson, postFormData} from "../utils/request.tsx";
import React from "react";

const PREFIX_HOME_CONFIG: string = import.meta.env.VITE_PREFIX_HOME_CONFIG as string;

export const getShowOns = async (
    page?: number,
    size?: number,
    filters?: Record<string, string | number>
): Promise<Response> => {
    const url = `${PREFIX_HOME_CONFIG}/all`;
    const params = {
        page,
        size,
        ...filters,
    };
    return handleRequest(getWithParams(url, params));
};

export const getContentByContentType = async (
    contentType: string,
    filters?: Record<string, string | number>
): Promise<Response> => {
    const url = `${PREFIX_HOME_CONFIG}/all-content`;
    const params = {
        contentType,
        ...filters,
    };
    return handleRequest(getWithParams(url, params));
};

export const postShowOn = (option: FormData): Promise<Response> => {
    const url = `${PREFIX_HOME_CONFIG}`;
    return handleRequest(postFormData(url, option));
};

export const deleteShowOns = (ids: React.Key[]): Promise<Response> => {
    const url = `${PREFIX_HOME_CONFIG}/${ids.join(',')}`;
    return handleRequest(del(url));
};

export const getShowOnById = (id: string): Promise<Response> => {
    const url = `${PREFIX_HOME_CONFIG}/${id}`;
    return handleRequest(get(url));
};

export const updateShowOnById = (id: string, option: FormData): Promise<Response> => {
    const url = `${PREFIX_HOME_CONFIG}/${id}`;
    return handleRequest(patchFormData(url, option));
};

export const switchStatusShowOn = (id: string): Promise<Response> => {
    return handleRequest(patchJson(`${PREFIX_HOME_CONFIG}/status/${id}`, {}));
};