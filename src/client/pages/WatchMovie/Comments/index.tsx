import React, { useState, useEffect, useCallback } from 'react';
import {
    getCommentByEpisode,
    postComment,
    deleteComment,
    Comment, // Assuming this type still matches the structure within the 'data' array
    CommentRequest,
    // patchComment, // Uncomment if needed for editing
    // CommentUpdate // Uncomment if needed for editing
} from '../../../services/movieCommentService'; // Adjust import path as needed
import './Comments.scss'; // Import SCSS file
import userStore from "../../../store/UserStore.tsx"; // Import user store

// --- Helper Function for Time Ago (English) ---
const timeAgo = (timestamp: string | undefined): string => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const secondsPast = (now.getTime() - date.getTime()) / 1000;

    if (secondsPast < 60) return `${Math.round(secondsPast)}s ago`;
    if (secondsPast < 3600) return `${Math.round(secondsPast / 60)}m ago`;
    if (secondsPast <= 86400) return `${Math.round(secondsPast / 3600)}h ago`;
    const daysPast = Math.round(secondsPast / 86400);
    if (daysPast === 1) return `yesterday`;
    if (daysPast <= 7) return `${daysPast}d ago`;
    // Optional: More specific date format
    // return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    return date.toLocaleDateString('en-US');
};


// --- Interfaces ---
interface CommentsProps {
    episodeId: number; // Only episodeId is needed as prop now
}

// This interface should match the structure of objects within the 'data' array from GET
// Ensure it includes 'user' with 'id', 'fullName', and optional 'avatar'
interface DisplayComment extends Comment {
    replies?: DisplayComment[];
    parentId?: number | null;
    user: { // Explicitly define the expected user structure
        id: number;
        fullName: string;
        avatar: string | null; // Avatar can be string or null/undefined
        slug: string | null;
    };
}

// Interface for the expected API response structure
interface ApiResponse<T> {
    status: number;
    message: string;
    data?: T; // Data is optional
}

// --- Main Component ---
const Comments: React.FC<CommentsProps> = ({ episodeId }) => {
    // Get user from Zustand store
    const user = userStore(state => state.user);

    const [comments, setComments] = useState<DisplayComment[]>([]);
    const [newComment, setNewComment] = useState<string>('');
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [replyContent, setReplyContent] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [posting, setPosting] = useState<boolean>(false);

    const MAX_COMMENT_LENGTH = 280; // Keep or adjust as needed

    // --- Fetch Comments ---
    const fetchComments = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getCommentByEpisode(episodeId);
            const result: ApiResponse<DisplayComment[]> = await response.json();

            if (!response.ok || result.status !== 200) {
                throw new Error(result.message || `HTTP error! status: ${response.status}`);
            }

            const fetchedData = result.data || [];

            // --- Nesting Logic ---
            const commentMap: { [key: number]: DisplayComment } = {};
            const topLevelComments: DisplayComment[] = [];

            // Pre-process to ensure 'replies' array exists and user data is present
            const processedData: DisplayComment[] = fetchedData
                .filter(c => c.user) // Filter out comments without user data if necessary
                .map(c => ({
                    ...c,
                    replies: c.replies || []
                }));

            processedData.forEach(comment => {
                commentMap[comment.id] = comment;
            });

            processedData.forEach(comment => {
                const parentId = comment.parentId;
                if (parentId && commentMap[parentId]) {
                    // Ensure parent's replies array exists before pushing
                    if (!commentMap[parentId].replies) {
                        commentMap[parentId].replies = [];
                    }
                    commentMap[parentId].replies!.push(comment);
                } else {
                    topLevelComments.push(comment);
                }
            });

            // Optional Sorting by creation date (newest first)
            const sortByDate = (a: DisplayComment, b: DisplayComment) =>
                new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();

            topLevelComments.sort(sortByDate);
            topLevelComments.forEach(c => c.replies?.sort(sortByDate));

            setComments(topLevelComments);

        } catch (err) {
            console.error("Failed to fetch comments:", err);
            setError(err instanceof Error ? err.message : "Could not load comments.");
        } finally {
            setLoading(false);
        }
    }, [episodeId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    // --- Handle Post/Reply ---
    const handlePostSubmit = async (e: React.FormEvent, content: string, parentId: number | null = null) => {
        e.preventDefault();
        if (!content.trim() || posting || !user) {
            if (!user) setError("You need to log in to comment.");
            return;
        };

        setPosting(true);
        setError(null);

        const commentData: CommentRequest = {
            episodeId: episodeId,
            parentId: parentId,
            content: content.trim(),
        };

        try {
            const response = await postComment(commentData);
            // Check if response is ok before parsing JSON
            if (!response.ok) {
                // Try to parse error message from API if available
                let errorMsg = `HTTP error! status: ${response.status}`;
                try {
                    const errorResult: ApiResponse<null> = await response.json();
                    errorMsg = errorResult.message || errorMsg;
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (parseError) {
                    // Ignore if response body is not JSON or empty
                }
                throw new Error(errorMsg);
            }

            const result: ApiResponse<{ id: number }> = await response.json();

            // Check status code in the response body (if API includes it)
            if (result.status < 200 || result.status >= 300) {
                throw new Error(result.message || `API error! status: ${result.status}`);
            }

            // Successfully posted, reset form and refetch
            if (parentId) {
                setReplyContent('');
                setReplyingTo(null);
            } else {
                setNewComment('');
            }
            await fetchComments(); // Refetch comments
            console.log("New comment ID:", result.data?.id);

        } catch (err) {
            console.error("Failed to post comment:", err);
            setError(err instanceof Error ? err.message : "Could not post comment.");
        } finally {
            setPosting(false);
        }
    };

    // --- Handle Delete ---
    const handleDelete = async (commentId: number) => {
        // Use English confirmation
        if (!window.confirm("Are you sure you want to delete this comment?")) {
            return;
        }
        setError(null);
        try {
            const response = await deleteComment(commentId);

            // Check if response is ok before parsing JSON
            if (!response.ok) {
                // Try to parse error message from API if available
                let errorMsg = `HTTP error! status: ${response.status}`;
                try {
                    const errorResult: ApiResponse<null> = await response.json();
                    errorMsg = errorResult.message || errorMsg;
                } catch (parseError) {
                    // Ignore if response body is not JSON or empty
                }
                throw new Error(errorMsg);
            }

            // Optional: Check status in response body if API sends one for DELETE
            // const result: ApiResponse<null> = await response.json();
            // if (result.status < 200 || result.status >= 300) {
            //     throw new Error(result.message || `API error! status: ${result.status}`);
            // }

            // Successfully deleted, refetch comments
            await fetchComments();

        } catch (err) {
            console.error("Failed to delete comment:", err);
            setError(err instanceof Error ? err.message : "Could not delete comment.");
        }
    };

    // --- Render Helper for Avatar ---
    const renderCommentAvatar = (commentUser: DisplayComment['user'] | null | undefined) => {
        // Handle cases where user might be null or undefined
        if (!commentUser) {
            // Render a generic placeholder if user data is missing
            return <div className="avatar-placeholder avatar-placeholder--large">?</div>;
        }

        const sizeClass = "avatar-large"; // Use large for all comment avatars per image 1
        const fallbackInitial = commentUser.fullName ? commentUser.fullName.charAt(0).toUpperCase() : '?';
        // Adjusted placeholder URL for better visibility on dark background
        const fallbackUrl = `https://placehold.co/40x40/6b7280/ffffff?text=${fallbackInitial}`; // Gray background, white text

        if (commentUser.avatar) {
            return <img src={commentUser.avatar} alt={commentUser.fullName || 'User Avatar'} className={`avatar ${sizeClass}`} onError={(e) => (e.currentTarget.src = fallbackUrl)} />;
        } else {
            return (
                <div className={`avatar-placeholder ${sizeClass}`}>
                    {fallbackInitial}
                </div>
            );
        }
    };

    // --- Render Helper for Current User Avatar (in form) ---
    const renderCurrentUserAvatar = () => {
        const sizeClass = "avatar-large";
        // Adjusted placeholder URL
        const fallbackUrl = (initial: string) => `https://placehold.co/40x40/6b7280/ffffff?text=${initial}`;

        if (user?.avatar) {
            const fallbackInitial = user.fullName ? user.fullName.charAt(0).toUpperCase() : 'Me';
            return <img src={user.avatar} alt={user.fullName || 'Your Avatar'} className={`avatar ${sizeClass}`} onError={(e) => (e.currentTarget.src = fallbackUrl(fallbackInitial))}/>;
        } else if (user) { // User logged in but no avatar
            const initial = user.fullName ? user.fullName.charAt(0).toUpperCase() : '?';
            return (
                <div className={`avatar-placeholder ${sizeClass}`}>
                    {initial}
                </div>
            );
        } else { // User not logged in
            return (
                <div className={`avatar-placeholder ${sizeClass}`}>
                    ?
                </div>
            );
        }
    };


    // --- Recursive Render Function for Comments and Replies ---
    const renderComment = (comment: DisplayComment, isReply: boolean = false) => {
        // Ensure user data exists before trying to render
        if (!comment.user) {
            console.warn("Comment missing user data:", comment.id);
            return null; // Don't render comments without user info
        }

        const isReplyingToThis = replyingTo === comment.id;
        const isOwner = user && comment.user.id === user.id;

        return (
            // Use comment-container for top-level and replies for styling consistency
            <div key={comment.id} className={`comment-container ${isReply ? 'comment-container--reply' : ''}`}>
                {/* Comment Author Avatar */}
                {renderCommentAvatar(comment.user)}

                {/* Comment Content Area */}
                <div className="comment-content">
                    <div className="comment-header">
                        <span className="comment-author">{comment.user.fullName || 'Anonymous'}</span>
                        <span className="comment-timestamp">
                            {/* Render · separator if both exist */}
                            {comment.user.fullName && comment.createdAt && ' · '}
                            {timeAgo(comment.createdAt)}
                        </span>
                    </div>
                    <p className="comment-text">{comment.content}</p>

                    {/* Action Buttons */}
                    <div className="comment-actions">
                        {/* Like Button */}
                        <button className="action-button action-button--like">
                            {/* Simple Like Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                            </svg>
                            Like
                        </button>
                        {/* Reply Button */}
                        {user && ( // Show only if user is logged in
                            <button onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)} className="action-button action-button--reply">
                                {/* Simple Reply Icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                </svg>
                                Reply
                            </button>
                        )}
                        {/* Delete Button */}
                        {isOwner && ( // Show only if user is owner
                            <button onClick={() => handleDelete(comment.id)} className="action-button action-button--delete">
                                {/* Simple Delete Icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                            </button>
                        )}
                        {/* Add Edit button here if needed */}
                    </div>

                    {/* Reply Input Form */}
                    {isReplyingToThis && user && (
                        // Use comment-form structure for replies as well
                        <div className="comment-form comment-form--reply">
                            {renderCurrentUserAvatar()} {/* Show current user avatar */}
                            <form onSubmit={(e) => handlePostSubmit(e, replyContent, comment.id)} className="comment-form__main">
                                <div className="comment-input comment-input--reply">
                                    <textarea
                                        value={replyContent}
                                        onChange={(e) => setReplyContent(e.target.value)}
                                        placeholder={`Replying to ${comment.user.fullName}...`}
                                        className="comment-input__textarea"
                                        rows={1} // Start with 1 row for replies
                                        maxLength={MAX_COMMENT_LENGTH}
                                        required
                                        autoFocus
                                    />
                                    {/* Optional: Character count for reply */}
                                    {/* <span className="comment-input__char-count">
                                        {replyContent.length}/{MAX_COMMENT_LENGTH}
                                    </span> */}
                                </div>
                                {/* Reply form actions */}
                                <div className="comment-form__actions comment-form__actions--reply">
                                    <button
                                        type="button"
                                        onClick={() => setReplyingTo(null)} // Cancel reply
                                        className="button button-secondary"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={posting || !replyContent.trim()}
                                        className={`button button-primary ${posting ? 'button-loading' : ''}`}
                                    >
                                        {posting ? 'Posting...' : 'Post'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Render Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                        <div className="comment-replies">
                            {comment.replies.map(reply => renderComment(reply, true))}
                        </div>
                    )}
                </div>
            </div>
        );
    };


    // --- Component Return ---
    return (
        <div className="comments-section">
            {/* Use total comments count (including replies) or adjust as needed */}
            <h2 className="comments-section__title">{comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0)} Comments</h2>

            {/* --- Post New Comment Form --- */}
            {user ? (
                <div className="comment-form">
                    {renderCurrentUserAvatar()}
                    <form onSubmit={(e) => handlePostSubmit(e, newComment)} className="comment-form__main">
                        <div className="comment-input">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                                className="comment-input__textarea"
                                rows={1} // Start with 1 row, expands on focus/typing (CSS)
                                maxLength={MAX_COMMENT_LENGTH}
                                // required // Handled by button disable state
                            />
                            {/* Optional: Character count */}
                            {/* <span className="comment-input__char-count">
                                {newComment.length}/{MAX_COMMENT_LENGTH}
                            </span> */}
                        </div>
                        {/* Actions appear when typing */}
                        {newComment.trim() && (
                            <div className="comment-form__actions">
                                <button
                                    type="button"
                                    onClick={() => setNewComment('')} // Clear comment
                                    className="button button-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={posting || !newComment.trim()}
                                    className={`button button-primary ${posting ? 'button-loading' : ''}`} // Use primary style for post
                                >
                                    {posting ? 'Posting...' : 'Comment'}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            ) : (
                // Use English login prompt
                <p className="login-prompt">Please <a href="/login">log in</a> to comment.</p>
            )}


            {/* Display Loading/Error States */}
            {loading && <p className="loading-message">Loading comments...</p>}
            {error && <p className="error-message">Error: {error}</p>}


            {/* --- Comments List --- */}
            {!loading && !error && (
                <div className="comments-list">
                    {comments.length === 0 ? (
                        // Use English message
                        <p className="no-comments-message">No comments yet. Be the first to comment!</p>
                    ) : (
                        // Render top-level comments
                        comments.map(comment => renderComment(comment, false))
                    )}
                </div>
            )}
        </div>
    );
};

export default Comments;