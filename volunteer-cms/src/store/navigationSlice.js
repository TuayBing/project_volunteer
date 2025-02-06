import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentPage: 'dashboard'
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    }
  }
});

export const { setCurrentPage } = navigationSlice.actions;
export const selectCurrentPage = (state) => state.navigation.currentPage;
export default navigationSlice.reducer;