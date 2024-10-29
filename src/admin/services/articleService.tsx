import {getWithParams} from "../utils/getWithParams.tsx";

const PREFIX_ARTICLE: string = import.meta.env.VITE_PREFIX_ARTICLE as string;

export const getArticles = async (page?: number, pageSize?: number, searchKey?: string, searchValue?: string): Promise<Response> => {
    try {
        const url = `${PREFIX_ARTICLE}s`;
        return getWithParams(url, page, pageSize, searchKey, searchValue);
    } catch (error) {
        console.error(error);
        throw error;
    }
};