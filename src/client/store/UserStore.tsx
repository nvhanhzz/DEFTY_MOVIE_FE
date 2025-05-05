// src/store/UserStore.tsx
import { create } from 'zustand';

// Interface User giữ nguyên
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

interface UserState {
    user: User | null;
    isLoading: boolean; // Trạng thái loading
    error: string | null; // Trạng thái lỗi (tuỳ chọn)
    setUser: (userData: User) => void;
    clearUser: () => void;
    setLoading: (loading: boolean) => void; // Action để set loading
    setError: (error: string | null) => void; // Action để set lỗi
}

const useUserStore = create<UserState>((set) => ({
    user: null,
    isLoading: true, // <-- Bắt đầu với trạng thái đang tải
    error: null,

    setUser: (userData) => set({
        user: userData,
        isLoading: false, // <-- Set loading thành false khi có user
        error: null
    }),

    clearUser: () => set({
        user: null,
        isLoading: false, // <-- Set loading thành false khi xóa user (hoàn tất kiểm tra)
        error: null // Có thể set lỗi nếu việc clear là do lỗi xác thực
    }),

    setLoading: (loading) => set({ isLoading: loading }),

    setError: (error) => set({
        error: error,
        isLoading: false, // <-- Thường thì khi có lỗi, quá trình tải cũng kết thúc
        user: null // Xóa user nếu lỗi liên quan đến xác thực
    }),
}));

export default useUserStore;