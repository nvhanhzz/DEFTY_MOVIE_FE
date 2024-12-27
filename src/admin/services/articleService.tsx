import {getWithParams} from "../utils/getWithParams.tsx";
import handleRequest from "../utils/handleRequest.tsx";
import {del, get, patchFormData, postFormData} from "../utils/request.tsx";
import React from "react";

const PREFIX_ARTICLE: string = import.meta.env.VITE_PREFIX_ARTICLE as string;

export const getArticles = async (page?: number, size?: number, searchKey?: string, searchValue?: string): Promise<Response> => {
    const url = `${PREFIX_ARTICLE}`;
    const params = { page, size, [searchKey || '']: searchValue }; // Optional search parameters
    return handleRequest(getWithParams(url, params));
};

export const postArticle = (option: FormData): Promise<Response> => {
    const url = `${PREFIX_ARTICLE}`;
    return handleRequest(postFormData(url, option));
};

export const deleteArticles = (ids: React.Key[]): Promise<Response> => {
    const url = `${PREFIX_ARTICLE}/${ids.join(',')}`;
    return handleRequest(del(url));
};

export const getArticleById = (id: string): Promise<Response> => {
    const url = `${PREFIX_ARTICLE}/${id}`;
    return handleRequest(get(url));
};

export const updateArticleById = (id: string, option: FormData): Promise<Response> => {
    const url = `${PREFIX_ARTICLE}/${id}`;
    return handleRequest(patchFormData(url, option));
};