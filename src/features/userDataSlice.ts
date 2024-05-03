import { createSlice } from '@reduxjs/toolkit';

const userDataSlice = createSlice({
  name: 'userData',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    fetchuserDataStart: (state) => {
      state.loading = true;
    },
    fetchuserDataSuccess: (state, action) => {    
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    },
    fetchuserDataFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
    fetchuserDataStart,
    fetchuserDataSuccess,
    fetchuserDataFailure,
} = userDataSlice.actions;

export default userDataSlice.reducer;