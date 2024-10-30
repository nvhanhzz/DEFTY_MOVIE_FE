import {del, get, patchFormData, postFormData} from "../utils/request";
import {getWithParams} from "../utils/getWithParams.tsx";

const PREFIX_ACCOUNT: string = import.meta.env.VITE_PREFIX_ACCOUNT as string;

export const getAccounts = async (page?: number, pageSize?: number, searchKey?: string, searchValue?: string): Promise<Response> => {
    try {
        const url = `${PREFIX_ACCOUNT}`;
        return getWithParams(url, page, pageSize, searchKey, searchValue);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const postAccount = async (option: FormData): Promise<Response> => {
    try {
        return await postFormData(`${PREFIX_ACCOUNT}/create-account`, option);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const deleteAccounts = async (ids: string[]): Promise<Response> => {
    try {
        const idString = ids.join(',');
        const url = `${PREFIX_ACCOUNT}/${idString}`;
        return await del(url);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getAccountById = async (id: string): Promise<Response> => {
    try {
        return await get(`${PREFIX_ACCOUNT}/${id}`);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const updateAccountById = async (id: string, option: FormData): Promise<Response> => {
    try {
        return await patchFormData(`${PREFIX_ACCOUNT}/${id}`, option);
    } catch (error) {
        console.error(error);
        throw error;
    }
}