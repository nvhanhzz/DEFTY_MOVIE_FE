import { Role } from "../pages/Role";
import { del, get, patchJson, postJson } from "../utils/request";
import {getWithParams} from "../utils/getWithParams.tsx";

const PREFIX_ROLE: string = import.meta.env.VITE_PREFIX_ROLE as string;

export const getRoles = async (page?: number, pageSize?: number, searchKey?: string, searchValue?: string): Promise<Response> => {
    try {
        const url = `${PREFIX_ROLE}`;
        return getWithParams(url, page, pageSize, searchKey, searchValue);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getRoleById = async (id: string): Promise<Response> => {
    try {
        const response = await get(`${PREFIX_ROLE}/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const createRole = async (option: { name: string; description: string }): Promise<Response> => {
    try {
        const response = await postJson(`${PREFIX_ROLE}`, option);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const updateRoleById = async (id: string, option: Role): Promise<Response> => {
    try {
        const response = await patchJson(`${PREFIX_ROLE}/${id}`, option);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const assignPermission = async (ids: string[], roleId: string): Promise<Response> => {
    try {
        const idString = ids.join(',');
        const url = `${PREFIX_ROLE}/assignment/${idString}?roleId=${roleId}`;

        const response = await patchJson(url, {});
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const unassignPermission = async (ids: string[], roleId: string): Promise<Response> => {
    try {
        const idString = ids.join(',');
        const url = `${PREFIX_ROLE}/unassignment/${idString}?roleId=${roleId}`;

        const response = await del(url);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};