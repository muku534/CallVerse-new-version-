// actions.js
export const LOGIN = 'LOGIN';
export const SIGNUP = 'SIGNUP';
export const FETCH_CONTACTS = "FETCH_CONTACTS";
export const ADD_CONTACTS = "ADD_CONTACTS";
export const LOGOUT = 'LOGOUT';
export const SET_ERRORS = 'SET_ERRORS';

export const loginUser = (userData) => ({
    type: LOGIN,
    payload: { userData },
});


export const fetchContact = (contacts) => ({
    type: FETCH_CONTACTS,
    payload: { contacts }
})

export const addContacts = (contacts) => ({
    type: ADD_CONTACTS,
    payload: { contacts },
});


export const logoutUser = () => ({
    type: LOGOUT,
});

export const setErrors = (errors) => ({
    type: SET_ERRORS,
    payload: { errors },
});
