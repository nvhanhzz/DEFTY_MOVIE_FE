import { ADD_ALERT, REMOVE_ALERT } from '../actions/alert';

export interface Alert {
    message: string;
    description: string;
    duration: number;
}

export interface AlertState {
    alerts: Alert[];
}

const initialState: AlertState = {
    alerts: [],
};

const alertReducer = (state = initialState, action: any): AlertState => {
    switch (action.type) {
        case ADD_ALERT:
            return {
                ...state,
                alerts: [...state.alerts, action.payload],
            };
        case REMOVE_ALERT:
            return {
                ...state,
                alerts: state.alerts.filter((_, index) => index !== action.payload),
            };
        default:
            return state;
    }
};

export default alertReducer;