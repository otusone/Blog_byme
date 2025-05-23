import { createSlice } from '@reduxjs/toolkit';
//const storedUser = JSON.parse(localStorage.getItem('user'));
//const storedToken = localStorage.getItem('token');


const initialState = {
    //user: storedUser && storedToken ? storedUser : null,
    user: null

};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action) {
            state.user = action.payload.user;
            state.token = action.payload.token;

            localStorage.setItem('user', JSON.stringify(action.payload.user));
            localStorage.setItem('token', action.payload.token);
        },
        logout(state) {
            state.user = null;
            state.token = null;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
