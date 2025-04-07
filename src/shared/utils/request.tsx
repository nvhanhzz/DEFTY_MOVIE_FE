const DOMAIN: string = import.meta.env.VITE_DOMAIN as string;
const PREFIX_API: string = import.meta.env.VITE_PREFIX_API as string;

export const get = async (path: string, token?: string): Promise<Response> => {
    try {
        const headers: Record<string, string> = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(DOMAIN + PREFIX_API + path, {
            method: 'GET',
            headers,
        });
        return response;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

export const postJson = async (path: string, data: Record<string, any>, token?: string): Promise<Response> => {
    try {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(DOMAIN + PREFIX_API + path, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
        });
        return response;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

export const postFormData = async (path: string, data: Record<string, any>, token?: string): Promise<Response> => {
    const formData = new FormData();
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            formData.append(key, data[key]);
        }
    }

    try {
        const headers: Record<string, string> = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(DOMAIN + PREFIX_API + path, {
            method: 'POST',
            headers,
            body: formData,
        });
        return response;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

export const patchJson = async (path: string, data: Record<string, any>, token?: string): Promise<Response> => {
    try {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(DOMAIN + PREFIX_API + path, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(data),
        });
        return response;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

export const patchFormData = async (path: string, data: Record<string, any>, token?: string): Promise<Response> => {
    const formData = new FormData();
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            formData.append(key, data[key]);
        }
    }

    try {
        const headers: Record<string, string> = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(DOMAIN + PREFIX_API + path, {
            method: 'PATCH',
            headers,
            body: formData,
        });
        return response;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

export const del = async (path: string, token?: string): Promise<Response> => {
    try {
        const headers: Record<string, string> = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(DOMAIN + PREFIX_API + path, {
            method: 'DELETE',
            headers,
        });
        return response;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};