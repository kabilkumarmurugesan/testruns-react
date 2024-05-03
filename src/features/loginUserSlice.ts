// userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const loginUserSlice = createSlice({
  name: 'userLogin',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    fetchLoginUserStart: (state) => {
      state.loading = true;
    },
    fetchLoginUserSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    },
    fetchLoginUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchLoginUserStart,
  fetchLoginUserSuccess,
  fetchLoginUserFailure,
} = loginUserSlice.actions;

export default loginUserSlice.reducer;
