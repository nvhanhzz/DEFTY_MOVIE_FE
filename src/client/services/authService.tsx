import {postJson, get} from "../utils/request.tsx";
import {LoginFormData, SignUpFormData} from "../components/Header/Auth";
import handleRequest from "../utils/handleRequest.tsx";

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

export const getCurrentAccount = (): Promise<Response> => {
    return handleRequest(get(`${PREFIX_CLIENT_AUTH}/check-account`));
};

export const postLogout = async (): Promise<Response> => {
    try {
        return await postJson(`${PREFIX_CLIENT_AUTH}/logout`, {});
    } catch (error) {
        console.error(error);
        throw error;
    }
}