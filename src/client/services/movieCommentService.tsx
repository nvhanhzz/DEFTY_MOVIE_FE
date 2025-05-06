import {postJson, get, patchJson, del} from "../utils/request.tsx";
import handleRequest from "../utils/handleRequest.tsx";

const PREFIX_CLIENT_MOVIE_COMMENT: string = import.meta.env.VITE_PREFIX_CLIENT_MOVIE_COMMENT as string;
const PREFIX_CLIENT_ACCESSIBLE: string = import.meta.env.VITE_PREFIX_CLIENT_ACCESSIBLE as string;

export type Comment = {
    id: number,
    content: string,
    createdAt: string,
    user: {
        id: number,
        fullName: string,
        avatar: string | null,
        slug: string | null
    }
}

export type CommentRequest = {
    episodeId: number,
    parentId: number | null,
    content: string
}

export type CommentUpdate = {
    content: string
}

export const getCommentByEpisode= async (episodeId: number): Promise<Response> => {
    return handleRequest(get(`${PREFIX_CLIENT_ACCESSIBLE}/${PREFIX_CLIENT_MOVIE_COMMENT}/${episodeId}`));
};

export const postComment = async (comment: CommentRequest): Promise<Response> => {
    try {
        return await postJson(`${PREFIX_CLIENT_MOVIE_COMMENT}`, comment);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const patchComment = async (commentId: number, comment: CommentUpdate): Promise<Response> => {
    try {
        return await patchJson(`${PREFIX_CLIENT_MOVIE_COMMENT}/${commentId}`, comment);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const deleteComment = async (commentId: number): Promise<Response> => {
    try {
        return await del(`${PREFIX_CLIENT_MOVIE_COMMENT}/${commentId}`);
    } catch (error) {
        console.error(error);
        throw error;
    }
}