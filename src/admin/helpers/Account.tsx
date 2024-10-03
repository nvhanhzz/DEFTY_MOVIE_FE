import { getCurrentAccount } from "../services/authService";
import { Account } from "../redux/actions/account";
import { getCookie } from "../../shared/utils/cookies";

export const setCurrentAccountHelper = async (): Promise<Account | null> => {
    const token = getCookie("admin_token");
    if (!token) {
        return null;
    }

    const response = await getCurrentAccount(token);
    const result = await response.json();
    if (!response.ok || result.status !== 200) {
        return null;
    }

    return {
        id: result.data.id,
        email: result.data.email,
        username: result.data.username,
        avatar: result.data.avatar,
        fullName: result.data.fullName,
        phone: result.data.phone,
        status: result.data.status,
        roleId: result.data.roleId
    };
};
