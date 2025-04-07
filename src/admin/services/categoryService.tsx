import {getWithParams} from "../utils/getWithParams.tsx";
import handleRequest from "../utils/handleRequest.tsx";
import {del, get, patchJson, postJson} from "../utils/request.tsx";
import React from "react";
import {Category} from "../pages/Category/Create";
const PREFIX_CATEGORY: string = import.meta.env.VITE_PREFIX_CATEGORY as string;
export const getCategories = async (
    page?: number,
    size?: number,
    filters?: Record<string, string | number>
): Promise<Response> => {
    const url = `${PREFIX_CATEGORY}/all`;
    const params = {
        page,
        size,
        ...filters,
    };
    return handleRequest(getWithParams(url, params));
};
export const postCategory = (option: Category): Promise<Response> => {
    const url = `${PREFIX_CATEGORY}`;
    return handleRequest(postJson(url, option));
};
export const deleteCategories = (ids: React.Key[]): Promise<Response> => {
    const url = `${PREFIX_CATEGORY}/${ids.join(',')}`;
    return handleRequest(del(url));
};
export const getCategoryById = (id: string): Promise<Response> => {
    const url = `${PREFIX_CATEGORY}/${id}`;
    return handleRequest(get(url));
};
export const updateCategoryById = (id: string, option: Category): Promise<Response> => {
    const url = `${PREFIX_CATEGORY}/${id}`;
    return handleRequest(patchJson(url, option));
};
export const switchStatusCategory = (id: string): Promise<Response> => {
    return handleRequest(patchJson(`${PREFIX_CATEGORY}/status/${id}`, {}));
};

export const getMoviesInCategory = async (
    categoryId: number | null,
    page?: number,
    size?: number,
    filters?: Record<string, string | number>
): Promise<Response> => {
    const url = `${PREFIX_CATEGORY}/${categoryId}/movies`;
    const params = {
        page,
        size,
        ...filters,
    };
    return handleRequest(getWithParams(url, params));
};

export const addMovieInCategory = (categoryId: number | null, ids: React.Key[]): Promise<Response> => {
    const url = `${PREFIX_CATEGORY}/${categoryId}/${ids.join(',')}`;
    return handleRequest(patchJson(url, ids));
};

export const getMoviesNotInCategory = async (
    categoryId: number | null,
    page?: number,
    size?: number,
    filters?: { title: string } | {}
): Promise<Response> => {
    const url = `${PREFIX_CATEGORY}/${categoryId}/other-movies`;
    const params = {
        page,
        size,
        ...filters,
    };
    return handleRequest(getWithParams(url, params));
};

export const deleteMovieOfCategory = (categoryId: number | null, ids: React.Key[]): Promise<Response> => {
    const url = `${PREFIX_CATEGORY}/${categoryId}/${ids.join(',')}`;
    return handleRequest(del(url));
};

