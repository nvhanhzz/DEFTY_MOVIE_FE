import {getWithParams} from "../utils/getWithParams.tsx";
import handleRequest from "../utils/handleRequest.tsx";

const PREFIX_ARTICLE: string = import.meta.env.VITE_PREFIX_ARTICLE as string;

export const getArticles = async (page?: number, pageSize?: number, searchKey?: string, searchValue?: string): Promise<Response> => {
    const url = `${PREFIX_ARTICLE}s`;
    const params = { page, pageSize, [searchKey || '']: searchValue }; // Optional search parameters
    return handleRequest(getWithParams(url, params));
};