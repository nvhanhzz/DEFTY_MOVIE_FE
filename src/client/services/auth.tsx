import {postJson} from "../utils/request.tsx";
import {SignUpFormData} from "../components/Header/Auth";

const PREFIX_CLIENT_AUTH: string = import.meta.env.VITE_PREFIX_CLIENT_AUTH as string;

export const postRegister = async (option: SignUpFormData): Promise<Response> => {
    try {
        return await postJson(`${PREFIX_CLIENT_AUTH}/register`, option);
    } catch (error) {
        console.error(error);
        throw error;
    }
}