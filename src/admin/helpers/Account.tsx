import { getCurrentAccount } from "../services/authService";
import { Account } from "../redux/actions/account";

export const setCurrentAccountHelper = async (): Promise<Account | null> => {
    const response = await getCurrentAccount();
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