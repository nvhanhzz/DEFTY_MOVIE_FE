import {postJson} from "../utils/request.tsx";
import {LoginFormData, SignUpFormData} from "../components/Header/Auth";

const PREFIX_CLIENT_AUTH: string = import.meta.env.VITE_PREFIX_CLIENT_AUTH as string;

export const postRegister = async (option: SignUpFormData): Promise<Response> => {
    try {
        return await postJson(`${PREFIX_CLIENT_AUTH}/register`, option);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const postLogin = async (option: LoginFormData): Promise<Response> => {
    try {
        return await postJson(`${PREFIX_CLIENT_AUTH}/login`, option);
    } catch (error) {
        console.error(error);
        throw error;
    }
}