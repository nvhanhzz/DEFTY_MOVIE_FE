import { get, postJson } from "../utils/request";
import handleRequest from "../utils/handleRequest.tsx";

const PREFIX_AUTH = import.meta.env.VITE_PREFIX_AUTH as string;

export const getCurrentAccount = (): Promise<Response> => {
    return handleRequest(get(`${PREFIX_AUTH}/check-account`));
};

export const postLogin = (option: Record<string, any>): Promise<Response> => {
    return handleRequest(postJson(`${PREFIX_AUTH}/login`, option));
};

export const postLogout = (): Promise<Response> => {
    return handleRequest(postJson(`${PREFIX_AUTH}/logout`, {}));
};