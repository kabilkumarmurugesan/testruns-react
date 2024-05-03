// assetsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const runsSlice = createSlice({
  name: 'runs',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    fetchRunsStart: (state) => {
      state.loading = true;
    },
    fetchRunsSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    },
    fetchRunsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

const chartTableSlice = createSlice({
  name: 'tableChart',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    fetchChartTableStart: (state) => {
      state.loading = true;
    },
    fetchChartTableSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    },
    fetchChartTableFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchRunsStart, fetchRunsSuccess, fetchRunsFailure } =
  runsSlice.actions;

export const {
  fetchChartTableStart,
  fetchChartTableSuccess,
  fetchChartTableFailure,
} = chartTableSlice.actions;

export const chartTableReducer = chartTableSlice.reducer;

export default runsSlice.reducer;
