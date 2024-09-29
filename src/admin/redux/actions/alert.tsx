export const ADD_ALERT = 'ADD_ALERT';
export const REMOVE_ALERT = 'REMOVE_ALERT';

export const addAlert = (message: string, description: string, duration: number) => ({
    type: ADD_ALERT,
    payload: { message, description, duration },
});

export const removeAlert = (index: number) => ({
    type: REMOVE_ALERT,
    payload: index,
});