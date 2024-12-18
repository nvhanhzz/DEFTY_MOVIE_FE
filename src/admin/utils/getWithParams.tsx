import { get } from "./request.tsx";
import {Moment} from "moment";

interface Params {
    [key: string]: string | number | Moment | undefined;
}

export const getWithParams = async (url: string, params: Params = {}) => {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
            if (key === 'page') {
                value = value as number - 1;
            }
            queryParams.append(key, value.toString());
        }
    });

    const queryString = queryParams.toString();
    return get(queryString ? `${url}?${queryString}` : url);
};