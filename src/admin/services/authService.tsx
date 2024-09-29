import { get } from "../../shared/utils/request";

const PREFIX_AUTH: string = import.meta.env.VITE_PREFIX_AUTH as string;
const PREFIX_ADMIN: string = import.meta.env.VITE_PREFIX_ADMIN as string;

export const getCurrentAdmin = async (token: string): Promise<Response> => {
    try {
        const result = await get(`${PREFIX_ADMIN}/${PREFIX_AUTH}/currentAdmin`, token);
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
};