const DOMAIN: string = import.meta.env.VITE_DOMAIN as string;
const PREFIX_API: string = import.meta.env.VITE_PREFIX_API as string;

export const get = async (path: string, token: string): Promise<Response> => {
    try {
        const response = await fetch(DOMAIN + PREFIX_API + path, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

export const postJson = async (path: string, data: Record<string, any>, token: string): Promise<Response> => {
    try {
        const response = await fetch(DOMAIN + PREFIX_API + path, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        return response;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

export const postFormData = async (path: string, data: Record<string, any>, token: string): Promise<Response> => {
    const formData = new FormData();
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            formData.append(key, data[key]);
        }
    }

    try {
        const response = await fetch(DOMAIN + PREFIX_API + path, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });
        return response;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

export const patchJson = async (path: string, data: Record<string, any>, token: string): Promise<Response> => {
    try {
        const response = await fetch(DOMAIN + PREFIX_API + path, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        return response;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

export const patchFormData = async (path: string, data: Record<string, any>, token: string): Promise<Response> => {
    const formData = new FormData();
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            formData.append(key, data[key]);
        }
    }

    try {
        const response = await fetch(DOMAIN + PREFIX_API + path, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });
        return response;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

export const del = async (path: string, token: string): Promise<Response> => {
    try {
        const response = await fetch(DOMAIN + PREFIX_API + path, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};