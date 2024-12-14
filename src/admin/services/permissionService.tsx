import { Permission } from "../pages/Permission/Create";
import { del, get, patchJson, postJson } from "../utils/request";
import { getWithParams } from "../utils/getWithParams.tsx";
import handleRequest from "../utils/handleRequest.tsx";

const PREFIX_PERMISSION = import.meta.env.VITE_PREFIX_PERMISSION as string;

export const getPermissions = (page?: number, pageSize?: number, searchKey?: string, searchValue?: string): Promise<Response> => {
    const url = `${PREFIX_PERMISSION}`;
    const params = { page, pageSize, [searchKey || '']: searchValue };
    return handleRequest(getWithParams(url, params));
};

export const postPermission = (option: Permission): Promise<Response> => {
    return handleRequest(postJson(`${PREFIX_PERMISSION}`, option));
};

export const deletePermissions = (ids: string[]): Promise<Response> => {
    const url = `${PREFIX_PERMISSION}/${ids.join(',')}`;
    return handleRequest(del(url));
};

export const getPermissionById = (id: string): Promise<Response> => {
    const url = `${PREFIX_PERMISSION}/${id}`;
    return handleRequest(get(url));
};

export const updatePermissionById = (id: string, option: Permission): Promise<Response> => {
    const url = `${PREFIX_PERMISSION}/${id}`;
    return handleRequest(patchJson(url, option));
};