import {getWithParams} from "../utils/getWithParams.tsx";
import handleRequest from "../utils/handleRequest.tsx";
import {patchJson} from "../utils/request.tsx";

const PREFIX_USER: string = import.meta.env.VITE_PREFIX_USER as string;

export const getUsers = async (
    page?: number,
    size?: number,
    filters?: Record<string, string | number>
): Promise<Response> => {
    const url = `${PREFIX_USER}`;
    const params = {
        page,
        size,
        ...filters,
    };
    return handleRequest(getWithParams(url, params));
};

export const switchStatusUser = (id: string): Promise<Response> => {
    return handleRequest(patchJson(`${PREFIX_USER}/status/${id}`, {}));
};