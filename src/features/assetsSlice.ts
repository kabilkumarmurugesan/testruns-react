// assetsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const assetsSlice = createSlice({
  name: 'assets',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    fetchAssetsStart: (state) => {
      state.loading = true;
    },
    fetchAssetsSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    },
    fetchAssetsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchAssetsStart,
  fetchAssetsSuccess,
  fetchAssetsFailure,
} = assetsSlice.actions;

export default assetsSlice.reducer;
