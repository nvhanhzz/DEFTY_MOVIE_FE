import { create } from 'zustand';

// Interface for User data (using the previous definition)
export interface User {
    id: number;
    username: string;
    email: string;
    fullName: string;
    phone: string;
    gender: string;
    address: string | null;
    avatar: string | null;
    status: string | null;
    dateOfBirth: string;
}

// Interface for the simple store state
interface UserState {
    user: User | null; // Chỉ lưu thông tin user
    setUser: (userData: User) => void; // Hàm để set user
    clearUser: () => void; // Hàm để xoá user (logout)
}

// Create the simple store
const useUserStore = create<UserState>((set) => ({
    // Initial state
    user: null,

    // Action to set the user data
    setUser: (userData) => set({ user: userData }),

    // Action to clear user data (logout)
    clearUser: () => set({ user: null }),
}));

export default useUserStore;