import { get, postJson } from "../utils/request";

const PREFIX_AUTH: string = import.meta.env.VITE_PREFIX_AUTH as string;

export const getCurrentAccount = async (): Promise<Response> => {
    try {
        const response = await get(`${PREFIX_AUTH}/check-account`);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const postLogin = async (option: Record<string, any>): Promise<Response> => {
    try {
        const response = await postJson(`${PREFIX_AUTH}/login`, option);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const postLogout = async (): Promise<Response> => {
    try {
        const response = await postJson(`${PREFIX_AUTH}/logout`, {});
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};