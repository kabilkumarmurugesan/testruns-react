import { createSlice } from '@reduxjs/toolkit';

const notificationMessageSlice = createSlice({
    name: 'notificationMessage',
    initialState: {
        data: null,
        loading: false,
        error: null,
    },
    reducers: {
        fetchNotificationMessageStart : (state)=>{
            state.loading = true
        },
        fetchNotificationMessageSuccess : (state, action) => {
            state.loading = false;
            state.data = action.payload;
            state.error = null;
          },
        fetchNotificationMessageFailure : (state, action) => {
            state.loading = false;
            state.error = action.payload;
          },
    }
})

export const {
    fetchNotificationMessageStart,
    fetchNotificationMessageSuccess,
    fetchNotificationMessageFailure
} = notificationMessageSlice.actions

export default notificationMessageSlice.reducer