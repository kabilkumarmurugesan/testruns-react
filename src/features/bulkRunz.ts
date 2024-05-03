import { createSlice } from '@reduxjs/toolkit';

const bulkRunzSlice = createSlice({
  name: 'bulkRunz',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    fetchbulkRunzStart: (state) => {
      state.loading = true;
    },
    fetchbulkRunzSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    },
    fetchbulkRunzFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
    fetchbulkRunzStart,
    fetchbulkRunzSuccess,
    fetchbulkRunzFailure,
} = bulkRunzSlice.actions;

export default bulkRunzSlice.reducer;