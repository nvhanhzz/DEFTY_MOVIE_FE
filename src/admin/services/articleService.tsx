import { get } from "../utils/request";

const PREFIX_ARTICLE: string = import.meta.env.VITE_PREFIX_ARTICLE as string;

export const getArticles = async (page?: number, pageSize?: number): Promise<Response> => {
    try {
        let url = `${PREFIX_ARTICLE}s`;

        const queryParams = new URLSearchParams();
        if (page !== undefined) queryParams.append("page", (page - 1).toString());
        if (pageSize !== undefined) queryParams.append("size", pageSize.toString());

        if (queryParams.toString()) {
            url += `?${queryParams.toString()}`;
        }

        const response = await get(url);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};