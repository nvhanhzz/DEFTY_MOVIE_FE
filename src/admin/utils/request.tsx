const DOMAIN: string = import.meta.env.VITE_DOMAIN as string;
const PREFIX_API: string = import.meta.env.VITE_PREFIX_API as string;
const PREFIX_ADMIN: string = import.meta.env.VITE_PREFIX_ADMIN as string;
const PREFIX_AUTH: string = import.meta.env.VITE_PREFIX_AUTH as string;

const refreshToken = async (): Promise<boolean> => {
    try {
        const response = await fetch(`${DOMAIN}/${PREFIX_API}/${PREFIX_ADMIN}/${PREFIX_AUTH}/refresh-token`, {
            method: 'POST',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to refresh token');
        }

        const result = await response.json();
        return result.status === 200;
    } catch (error) {
        console.error('Error refreshing access token:', error);
        handleRefreshTokenFailure();
        return false;
    }
};

const handleRefreshTokenFailure = () => {
    alert('Your session has expired. Please log in again.');
};

const requestWithRefresh = async (path: string, options: RequestInit): Promise<Response> => {
    const fullPath = `${DOMAIN}/${PREFIX_API}/${PREFIX_ADMIN}/${path}`;

    try {
        let response = await fetch(fullPath, { credentials: 'include', ...options });

        if (response.status === 401) {
            const isRefreshSuccessful = await refreshToken();

            if (isRefreshSuccessful) {
                response = await fetch(fullPath, { credentials: 'include', ...options });
            } else {
                throw new Error('Failed to refresh token after 401');
            }
        }

        return response;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

export const get = async (path: string): Promise<Response> => {
    return requestWithRefresh(path, {
        method: 'GET',
    });
};

export const postJson = async (path: string, data: Record<string, any>): Promise<Response> => {
    return requestWithRefresh(path, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
};

export const postFormData = async (path: string, data: Record<string, any>): Promise<Response> => {
    const formData = new FormData();
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            formData.append(key, data[key]);
        }
    }

    return requestWithRefresh(path, {
        method: 'POST',
        body: formData,
    });
};

export const patchJson = async (path: string, data: Record<string, any>): Promise<Response> => {
    return requestWithRefresh(path, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
};

export const patchFormData = async (path: string, data: Record<string, any>): Promise<Response> => {
    const formData = new FormData();
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            formData.append(key, data[key]);
        }
    }

    return requestWithRefresh(path, {
        method: 'PATCH',
        body: formData,
    });
};

export const del = async (path: string): Promise<Response> => {
    return requestWithRefresh(path, {
        method: 'DELETE',
    });
};