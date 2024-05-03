// fileUploadSlice.js
import { createSlice } from '@reduxjs/toolkit';

const fileUploadSlice = createSlice({
  name: 'fileUpload',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    fileUploadStart: (state) => {
      state.loading = true;
    },
    fileUploadSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    },
    fileUploadFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fileUploadStart, fileUploadSuccess, fileUploadFailure } =
  fileUploadSlice.actions;

export default fileUploadSlice.reducer;
