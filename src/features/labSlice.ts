// departmentSlice.js
import { createSlice } from '@reduxjs/toolkit';

const labSlice = createSlice({
  name: 'lab',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    fetchLabStart: (state) => {
      state.loading = true;
    },
    fetchLabSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    },
    fetchLabFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchLabStart,
  fetchLabSuccess,
  fetchLabFailure,
} = labSlice.actions;

export default labSlice.reducer;
