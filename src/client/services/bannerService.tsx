import handleRequest from "../utils/handleRequest.tsx";
import {getWithParams} from "../utils/getWithParams.tsx";

const PREFIX_CLIENT_ACCESSIBLE: string = import.meta.env.VITE_PREFIX_CLIENT_ACCESSIBLE as string;
const PREFIX_CLIENT_BANNER: string = import.meta.env.VITE_PREFIX_CLIENT_BANNER as string;

export const getBanners = async (
    title?: string
): Promise<Response> => {
    const url = `${PREFIX_CLIENT_ACCESSIBLE}/${PREFIX_CLIENT_BANNER}/all`;
    const params = {
        title
    };
    return handleRequest(getWithParams(url, params));
}