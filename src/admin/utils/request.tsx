const DOMAIN: string = import.meta.env.VITE_DOMAIN as string;
const PREFIX_API: string = import.meta.env.VITE_PREFIX_API as string;
const PREFIX_ADMIN: string = import.meta.env.VITE_PREFIX_ADMIN as string;
const PREFIX_AUTH: string = import.meta.env.VITE_PREFIX_AUTH as string;

const refreshAccessToken = async (): Promise<void> => {
    try {
        const response = await fetch(`${DOMAIN}/${PREFIX_ADMIN}/${PREFIX_AUTH}/refresh-token`, {
            method: 'POST',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to refresh token');
        }
    } catch (error) {
        console.error('Error refreshing access token:', error);
        handleRefreshTokenFailure();
        throw error;
    }
};

const handleRefreshTokenFailure = () => {
    alert('Your session has expired. Please log in again.');
    // window.location.href = '/login';
};

export const get = async (path: string): Promise<Response> => {
    try {
        const response = await fetch(`${DOMAIN}/${PREFIX_API}/${PREFIX_ADMIN}/${path}`, {
            method: 'GET',
            credentials: 'include',
        });

        if (response.status === 401) {
            await refreshAccessToken();
            return await fetch(`${DOMAIN}/${PREFIX_API}/${PREFIX_ADMIN}/${path}`, {
                method: 'GET',
                credentials: 'include',
            });
        }

        return response;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

export const postJson = async (path: string, data: Record<string, any>): Promise<Response> => {
    try {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        const response = await fetch(`${DOMAIN}/${PREFIX_API}/${PREFIX_ADMIN}/${path}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
            credentials: 'include',
        });

        if (response.status === 401) {
            await refreshAccessToken();
            return await fetch(`${DOMAIN}/${PREFIX_API}/${PREFIX_ADMIN}/${path}`, {
                method: 'POST',
                headers,
                body: JSON.stringify(data),
                credentials: 'include',
            });
        }

        return response;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

export const postFormData = async (path: string, data: Record<string, any>): Promise<Response> => {
    const formData = new FormData();
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            formData.append(key, data[key]);
        }
    }

    try {
        const response = await fetch(`${DOMAIN}/${PREFIX_API}/${PREFIX_ADMIN}/${path}`, {
            method: 'POST',
            body: formData,
            credentials: 'include',
        });

        if (response.status === 401) {
            await refreshAccessToken();
            return await fetch(`${DOMAIN}/${PREFIX_API}/${PREFIX_ADMIN}/${path}`, {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });
        }

        return response;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

export const patchJson = async (path: string, data: Record<string, any>): Promise<Response> => {
    try {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        const response = await fetch(`${DOMAIN}/${PREFIX_API}/${PREFIX_ADMIN}/${path}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(data),
            credentials: 'include',
        });

        if (response.status === 401) {
            await refreshAccessToken();
            return await fetch(`${DOMAIN}/${PREFIX_API}/${PREFIX_ADMIN}/${path}`, {
                method: 'PATCH',
                headers,
                body: JSON.stringify(data),
                credentials: 'include',
            });
        }

        return response;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

export const patchFormData = async (path: string, data: Record<string, any>): Promise<Response> => {
    const formData = new FormData();
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            formData.append(key, data[key]);
        }
    }

    try {
        const response = await fetch(`${DOMAIN}/${PREFIX_API}/${PREFIX_ADMIN}/${path}`, {
            method: 'PATCH',
            body: formData,
            credentials: 'include',
        });

        if (response.status === 401) {
            await refreshAccessToken();
            return await fetch(`${DOMAIN}/${PREFIX_API}/${PREFIX_ADMIN}/${path}`, {
                method: 'PATCH',
                body: formData,
                credentials: 'include',
            });
        }

        return response;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

export const del = async (path: string): Promise<Response> => {
    try {
        const response = await fetch(`${DOMAIN}/${PREFIX_API}/${PREFIX_ADMIN}/${path}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (response.status === 401) {
            await refreshAccessToken();
            return await fetch(`${DOMAIN}/${PREFIX_API}/${PREFIX_ADMIN}/${path}`, {
                method: 'DELETE',
                credentials: 'include',
            });
        }

        return response;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};