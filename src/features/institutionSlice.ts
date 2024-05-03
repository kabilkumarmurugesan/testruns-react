import { createSlice } from '@reduxjs/toolkit';

const institutionSlice = createSlice({
  name: 'institution',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    fetchinstitutionStart: (state) => {
      state.loading = true;
    },
    fetchinstitutionSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    },
    fetchinstitutionFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchinstitutionStart,
  fetchinstitutionSuccess,
  fetchinstitutionFailure,
} = institutionSlice.actions;

export default institutionSlice.reducer;