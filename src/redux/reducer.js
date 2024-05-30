import {
    LOGIN,
    SIGNUP,
    FETCH_CONTACTS,
    SET_ERRORS,
    LOGOUT
} from "./action";


const initialState = {
    userData: null,
    contacts: [],
    loading: false,
    errors: null,
};


const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN:
        case SIGNUP:
            return {
                ...state,
                userData: action.payload.userData,
                errors: null,
            };
        case FETCH_CONTACTS:
            console.log("Fetched Contacts:", action.payload.contacts);
            return {
                ...state,
                contacts: action.payload.contacts,
                errors: null
            };
        case LOGOUT:
            return {
                ...state,
                userData: null,
                errors: null,
            };
        case SET_ERRORS:
            return {
                ...state,
                errors: action.payload.errors,
            };
        default:
            return state;
    }
};

export default rootReducer; 