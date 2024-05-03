// departmentSlice.js
import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
    name: 'notification',
    initialState: {
        data: null,
        loading: false,
        error: null,
    },
    reducers: {
        fetchNotificationStart: (state) => {
            state.loading = true;
        },
        fetchNotificationSuccess: (state, action) => {
            state.loading = false;
            state.data = action.payload;
            state.error = null;
        },
        fetchNotificationFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    fetchNotificationStart,
    fetchNotificationSuccess,
    fetchNotificationFailure,
} = notificationSlice.actions;

export default notificationSlice.reducer;
