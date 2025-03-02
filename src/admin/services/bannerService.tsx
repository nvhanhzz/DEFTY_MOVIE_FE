import {getWithParams} from "../utils/getWithParams.tsx";
import handleRequest from "../utils/handleRequest.tsx";
import {del, get, patchFormData, patchJson, postFormData} from "../utils/request.tsx";
import React from "react";

const PREFIX_BANNER: string = import.meta.env.VITE_PREFIX_BANNER as string;

export const getBanners = async (
    page?: number,
    size?: number,
    filters?: Record<string, string | number>
): Promise<Response> => {
    const url = `${PREFIX_BANNER}/all`;
    const params = {
        page,
        size,
        ...filters,
    };
    return handleRequest(getWithParams(url, params));
};

export const postBanner = (option: FormData): Promise<Response> => {
    const url = `${PREFIX_BANNER}`;
    return handleRequest(postFormData(url, option));
};

export const deleteBanners = (ids: React.Key[]): Promise<Response> => {
    const url = `${PREFIX_BANNER}/${ids.join(',')}`;
    return handleRequest(del(url));
};

export const getBannerById = (id: string): Promise<Response> => {
    const url = `${PREFIX_BANNER}/${id}`;
    return handleRequest(get(url));
};

export const updateBannerById = (id: string, option: FormData): Promise<Response> => {
    const url = `${PREFIX_BANNER}/${id}`;
    return handleRequest(patchFormData(url, option));
};

export const switchStatusBanner = (id: string): Promise<Response> => {
    return handleRequest(patchJson(`${PREFIX_BANNER}/status/${id}`, {}));
};