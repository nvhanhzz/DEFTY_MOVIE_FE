import { get } from "./request.tsx";

export const getWithParams = async (url: string, page?: number, pageSize?: number, searchKey?: string, searchValue?: string) => {
    const queryParams = new URLSearchParams();

    if (page !== undefined) queryParams.append("page", (page - 1).toString());
    if (pageSize !== undefined) queryParams.append("size", pageSize.toString());

    if (searchKey && searchValue) {
        queryParams.append(searchKey, searchValue);
    }

    if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
    }

    return await get(url);
}