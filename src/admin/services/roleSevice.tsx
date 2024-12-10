import { Role } from "../pages/Role";
import { del, get, patchJson, postJson } from "../utils/request";
import { getWithParams } from "../utils/getWithParams.tsx";
import handleRequest from "../utils/handleRequest.tsx";

const PREFIX_ROLE = import.meta.env.VITE_PREFIX_ROLE as string;

export const getRoles = (page?: number, pageSize?: number, searchKey?: string, searchValue?: string): Promise<Response> => {
    const url = `${PREFIX_ROLE}`;
    const params = { page, pageSize, [searchKey || '']: searchValue };
    return handleRequest(getWithParams(url, params));
};

export const getRoleById = (id: string): Promise<Response> => {
    return handleRequest(get(`${PREFIX_ROLE}/${id}`));
};

export const createRole = (option: { name: string; description: string }): Promise<Response> => {
    return handleRequest(postJson(`${PREFIX_ROLE}`, option));
};

export const updateRoleById = (id: string, option: Role): Promise<Response> => {
    return handleRequest(patchJson(`${PREFIX_ROLE}/${id}`, option));
};

export const assignPermission = (ids: string[], roleId: string): Promise<Response> => {
    const idString = ids.join(',');
    const url = `${PREFIX_ROLE}/assignment/${idString}?roleId=${roleId}`;
    return handleRequest(patchJson(url, {}));
};

export const unassignPermission = (ids: string[], roleId: string): Promise<Response> => {
    const idString = ids.join(',');
    const url = `${PREFIX_ROLE}/unassignment/${idString}?roleId=${roleId}`;
    return handleRequest(del(url));
};