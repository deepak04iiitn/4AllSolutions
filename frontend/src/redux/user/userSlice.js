import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    currentUser : null,
    error : null,
    loading : false
}

const userSlice = createSlice({
    name : 'user',
    initialState,
    reducers : {                               // // here we add the logics for the functionalities we want
        signInStart : (state) => {
            state.loading = true;
            state.error = null;
        },
        signInSuccess : (state , action) => {
            state.currentUser = action.payload;       // user data is payload
            state.loading = false;
            state.error = null;
        },
        signInFailure : (state , action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateStart : (state) => {
            state.loading = true;
            state.error = null;
        },
        updateSuccess : (state , action) => {
            state.currentUser = action.payload;       // user data is payload
            state.loading = false;
            state.error = null;
        },
        updateFailure : (state , action) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteUserStart : (state) => {
            state.loading = true;
            state.error = null;
        },
        deleteUserSuccess : (state) => {
            state.currentUser = null;               // removing the person
            state.loading = false;
            state.error = null;
        },
        deleteUserFailure : (state , action) => {
            state.loading = false;
            state.error = action.payload;
        },
        signoutSuccess: (state) => {
            state.currentUser = null;
            state.error = null;
            state.loading = false;
        },
    }
});

export const { signInFailure , signInStart , signInSuccess , updateStart , updateSuccess , updateFailure , 
    deleteUserStart , deleteUserSuccess , deleteUserFailure , signoutSuccess
 } = userSlice.actions;

export default userSlice.reducer;