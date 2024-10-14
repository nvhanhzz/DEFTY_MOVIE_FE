import { Permission } from "../pages/Permission/Create";
import { del, get, postJson } from "../utils/request";

const PREFIX_PERMISSION: string = import.meta.env.VITE_PREFIX_PERMISSION as string;

export const getAllPermission = async (): Promise<Response> => {
    try {
        const response = await get(`${PREFIX_PERMISSION}/all`);
        return response;
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