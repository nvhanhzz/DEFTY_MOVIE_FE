export const setCookie = (key: string, value: string, days: number = 7): void => {
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + days * 24 * 60 * 60 * 1000); // Set expiration time
    const expires = `expires=${expirationDate.toUTCString()}`;
    document.cookie = `${key}=${value}; ${expires}; path=/`; // Store cookie with expiration
};

export const getCookie = (key: string): string => {
    const name = key + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return "";
};

export const deleteCookie = (key: string): void => {
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`; // Expired date
};