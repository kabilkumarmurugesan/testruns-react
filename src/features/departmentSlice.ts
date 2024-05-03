// departmentSlice.js
import { createSlice } from '@reduxjs/toolkit';

const departmentSlice = createSlice({
  name: 'department',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    fetchDepartmentStart: (state) => {
      state.loading = true;
    },
    fetchDepartmentSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    },
    fetchDepartmentFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchDepartmentStart,
  fetchDepartmentSuccess,
  fetchDepartmentFailure,
} = departmentSlice.actions;

export default departmentSlice.reducer;
