import { createSlice } from '@reduxjs/toolkit';

const userRunsSlice = createSlice({
  name: 'userRuns',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    fetchUserRunsStart: (state) => {
      state.loading = true;
    },
    fetchUserRunsSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    },
    fetchUserRunsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchUserRunsStart,
  fetchUserRunsSuccess,
  fetchUserRunsFailure,
} = userRunsSlice.actions;

export default userRunsSlice.reducer;