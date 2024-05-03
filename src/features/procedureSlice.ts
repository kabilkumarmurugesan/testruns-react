import { createSlice } from '@reduxjs/toolkit';

const procedureSlice = createSlice({
  name: 'procedure',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    fetchProcedureStart: (state) => {
      state.loading = true;
    },
    fetchProcedureSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    },
    fetchProcedureFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchProcedureStart,
  fetchProcedureSuccess,
  fetchProcedureFailure,
} = procedureSlice.actions;

export default procedureSlice.reducer;
