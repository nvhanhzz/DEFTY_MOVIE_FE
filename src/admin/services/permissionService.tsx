import {Permission} from "../pages/Permission/Create";
import {del, get, patchJson, postJson} from "../utils/request";
import handleRequest from "../utils/handleRequest.tsx";
import {getWithParams} from "../utils/getWithParams.tsx";

const PREFIX_PERMISSION: string = import.meta.env.VITE_PREFIX_PERMISSION as string;

export const getPermissions = async (
    page?: number,
    size?: number,
    filters?: Record<string, string | number>
): Promise<Response> => {
    const url = `${PREFIX_PERMISSION}`;
    const params = {
        page,
        size,
        ...filters,
    };
    return handleRequest(getWithParams(url, params));
};

export const postPermission = async (option: Permission): Promise<Response> => {
    try {
        return await postJson(`${PREFIX_PERMISSION}`, option);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const deletePermissions = async (ids: string[]): Promise<Response> => {
    try {
        const idString = ids.join(',');
        const url = `${PREFIX_PERMISSION}/${idString}`;
        return await del(url);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getPermissionById = async (id: string): Promise<Response> => {
    try {
        return await get(`${PREFIX_PERMISSION}/${id}`);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const updatePermissionById = async (id: string, option: Permission): Promise<Response> => {
    try {
        return await patchJson(`${PREFIX_PERMISSION}/${id}`, option);
    } catch (error) {
        console.error(error);
        throw error;
    }
}