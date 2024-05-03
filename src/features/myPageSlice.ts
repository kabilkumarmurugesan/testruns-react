// assetsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const myPageSlice = createSlice({
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

const CalendarEventSlice = createSlice({
  name: 'calendar_event',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    fetchCalendarEventStart: (state) => {
      state.loading = true;
    },
    fetchCalendarEventSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    },
    fetchCalendarEventFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchCalendarEventStart,
  fetchCalendarEventSuccess,
  fetchCalendarEventFailure,
} = CalendarEventSlice.actions;

export const CalendarEventReducer = CalendarEventSlice.reducer;

export const { fetchRunsStart, fetchRunsSuccess, fetchRunsFailure } =
  myPageSlice.actions;

export default myPageSlice.reducer;
