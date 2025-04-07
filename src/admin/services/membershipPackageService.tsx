import handleRequest from "../utils/handleRequest.tsx";
import {getWithParams} from "../utils/getWithParams.tsx";
import {del, get, patchJson, patchStatus, postJson} from "../utils/request.tsx";
import {MembershipPackage} from "../pages/MembershipPackage";

const PREFIX_MEMBERSHIP_PACKAGE = import.meta.env.VITE_PREFIX_MEMBERSHIP_PACKAGE as string;

export const getMembershipPackets = async (
    page?: number,
    size?: number,
    filters?: Record<string, string | number>
): Promise<Response> => {
    const url = `${PREFIX_MEMBERSHIP_PACKAGE}`;
    const params = {
        page,
        size,
        ...filters,
    };
    return handleRequest(getWithParams(url, params));
};

export const getMembershipPacketById = (id: string): Promise<Response> => {
    return handleRequest(get(`${PREFIX_MEMBERSHIP_PACKAGE}/${id}`));
};

export const createMembershipPacket = (option: { name: string; description: string }): Promise<Response> => {
    return handleRequest(postJson(`${PREFIX_MEMBERSHIP_PACKAGE}`, option));
};

export const updateMembershipPacketById = (id: string, option: MembershipPackage): Promise<Response> => {
    return handleRequest(patchJson(`${PREFIX_MEMBERSHIP_PACKAGE}/${id}`, option));
};

export const switchStatus = (id: string): Promise<Response> => {
    return handleRequest(patchStatus(`${PREFIX_MEMBERSHIP_PACKAGE}/status/${id}`));
};

export const deleteMembershipPacket = (ids: string[]): Promise<Response> => {
    const idString = ids.join(',');
    const url = `${PREFIX_MEMBERSHIP_PACKAGE}/${idString}`;
    return handleRequest(del(url));
};