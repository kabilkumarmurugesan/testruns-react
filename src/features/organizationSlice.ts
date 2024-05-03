// departmentSlice.js
import { createSlice } from '@reduxjs/toolkit';

const organizationSlice = createSlice({
  name: 'organization',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    fetchOrganizationStart: (state) => {
      state.loading = true;
    },
    fetchOrganizationSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    },
    fetchOrganizationFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchOrganizationStart,
  fetchOrganizationSuccess,
  fetchOrganizationFailure,
} = organizationSlice.actions;

export default organizationSlice.reducer;
