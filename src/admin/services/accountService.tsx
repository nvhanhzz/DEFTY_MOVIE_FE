import {del, get, patchJson, postJson} from "../utils/request";
import {getWithParams} from "../utils/getWithParams.tsx";
import {Account} from "../pages/Account";

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

export const postAccount = async (option: Account): Promise<Response> => {
    try {
        return await postJson(`${PREFIX_ACCOUNT}`, option);
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

export const updateAccountById = async (id: string, option: Account): Promise<Response> => {
    try {
        return await patchJson(`${PREFIX_ACCOUNT}/${id}`, option);
    } catch (error) {
        console.error(error);
        throw error;
    }
}