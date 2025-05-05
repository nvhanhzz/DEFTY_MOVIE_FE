import {del, get, patchFormData, patchStatus, postFormData} from "../utils/request";
import {getWithParams} from "../utils/getWithParams.tsx";
import handleRequest from "../utils/handleRequest.tsx";

const PREFIX_ACCOUNT = import.meta.env.VITE_PREFIX_ACCOUNT as string;

export const getAccounts = async (
    page?: number,
    size?: number,
    filters?: Record<string, string | number>
): Promise<Response> => {
    const url = `${PREFIX_ACCOUNT}`;
    const params = {
        page,
        size,
        ...filters,
    };
    return handleRequest(getWithParams(url, params));
};

export const postAccount = (option: FormData): Promise<Response> => {
    const url = `${PREFIX_ACCOUNT}/create-account`;
    return handleRequest(postFormData(url, option));
};

export const switchStatusAccount = (id: string): Promise<Response> => {
    return handleRequest(patchStatus(`${PREFIX_ACCOUNT}/status/${id}`));
};

export const deleteAccounts = (ids: string[]): Promise<Response> => {
    const url = `${PREFIX_ACCOUNT}/${ids.join(',')}`;
    return handleRequest(del(url));
};

export const getAccountById = (id: string): Promise<Response> => {
    const url = `${PREFIX_ACCOUNT}/${id}`;
    return handleRequest(get(url));
};

export const updateAccountById = (id: string, option: FormData): Promise<Response> => {
    const url = `${PREFIX_ACCOUNT}/${id}`;
    return handleRequest(patchFormData(url, option));
};

export const updateProfile = (option: FormData): Promise<Response> => {
    const url = `${PREFIX_ACCOUNT}/profile`;
    return handleRequest(patchFormData(url, option));
}