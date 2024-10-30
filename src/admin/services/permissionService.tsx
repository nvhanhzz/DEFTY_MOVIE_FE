import { Permission } from "../pages/Permission/Create";
import { del, get, patchJson, postJson } from "../utils/request";
import {getWithParams} from "../utils/getWithParams.tsx";

const PREFIX_PERMISSION: string = import.meta.env.VITE_PREFIX_PERMISSION as string;

export const getPermissions = async (page?: number, pageSize?: number, searchKey?: string, searchValue?: string): Promise<Response> => {
    try {
        const url = `${PREFIX_PERMISSION}`;
        return getWithParams(url, page, pageSize, searchKey, searchValue);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const postPermission = async (option: Permission): Promise<Response> => {
    try {
        const response = await postJson(`${PREFIX_PERMISSION}`, option);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const deletePermissions = async (ids: string[]): Promise<Response> => {
    try {
        const idString = ids.join(',');
        const url = `${PREFIX_PERMISSION}/${idString}`;
        const response = await del(url);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getPermissionById = async (id: string): Promise<Response> => {
    try {
        const response = await get(`${PREFIX_PERMISSION}/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const updatePermissionById = async (id: string, option: Permission): Promise<Response> => {
    try {
        const response = await patchJson(`${PREFIX_PERMISSION}/${id}`, option);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}