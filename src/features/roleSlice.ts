// departmentSlice.js
import { createSlice } from "@reduxjs/toolkit";

const roleSlice = createSlice({
  name: "role",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    fetchRoleStart: (state: any) => {
      state.loading = true;
    },
    fetchRoleSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    },
    fetchRoleFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchRoleStart, fetchRoleSuccess, fetchRoleFailure } =
  roleSlice.actions;

export default roleSlice.reducer;
