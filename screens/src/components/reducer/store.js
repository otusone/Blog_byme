import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
const savedUser = JSON.parse(localStorage.getItem('user'));
export const store = configureStore({
    reducer: {
        auth: authReducer,
    },
    preloadedState: {
        auth: {
            user: savedUser || null,
        },
    },
});
