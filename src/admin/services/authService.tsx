import { get, postJson } from "../../shared/utils/request";

const PREFIX_AUTH: string = import.meta.env.VITE_PREFIX_AUTH as string;
const PREFIX_ADMIN: string = import.meta.env.VITE_PREFIX_ADMIN as string;

export const getCurrentAccount = async (token: string): Promise<Response> => {
    try {
        const response = await get(`${PREFIX_ADMIN}/${PREFIX_AUTH}/check-account`, token);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const postLogin = async (option: Record<string, any>): Promise<Response> => {
    try {
        const response = await postJson(`${PREFIX_ADMIN}/${PREFIX_AUTH}/login`, option);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};