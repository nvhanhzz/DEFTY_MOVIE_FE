import handleRequest from "../utils/handleRequest.tsx";
import {getWithParams} from "../utils/getWithParams.tsx";

const PREFIX_CLIENT_ACCESSIBLE: string = import.meta.env.VITE_PREFIX_CLIENT_ACCESSIBLE as string;
const PREFIX_CLIENT_SHOW_ON: string = import.meta.env.VITE_PREFIX_CLIENT_SHOW_ON as string;

export const getShowOns = async (
    title?: string
): Promise<Response> => {
    const url = `${PREFIX_CLIENT_ACCESSIBLE}/${PREFIX_CLIENT_SHOW_ON}/all`;
    const params = {
        title
    };
    return handleRequest(getWithParams(url, params));
}