/* eslint-disable @typescript-eslint/no-explicit-any */
// userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const resetReduxSlice = createSlice({
  
  name: 'userLogout',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    
    resetUserData: (state: any) => {
      state.data = undefined;
    },
  },
});

export const { resetUserData } = resetReduxSlice.actions;

export default resetReduxSlice.reducer;
