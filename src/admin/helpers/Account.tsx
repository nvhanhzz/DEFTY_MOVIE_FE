import { getCurrentAccount } from "../services/authService";
import { AccountRedux } from "../redux/actions/accountRedux.tsx";

export const setCurrentAccountHelper = async (): Promise<AccountRedux | null> => {
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
        role: result.data.role,
        dateOfBirth: result.data.dateOfBirth,
        address: result.data.address,
        gender: result.data.gender
    };
};