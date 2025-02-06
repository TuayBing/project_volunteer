import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/axios';

// สร้าง async thunk สำหรับ fetch stats
export const fetchStats = createAsyncThunk(
  'users/fetchStats',
  async () => {
    const response = await api.get('/user/stats');
    return response.data.data;
  }
);

// สร้าง async thunk สำหรับลบ user
export const deleteUserAsync = createAsyncThunk(
  'users/deleteUser',
  async (userId) => {
    const response = await api.delete(`/user/${userId}`);
    return userId;
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState: {
    stats: {
      totalUsers: 0,
      newUsersThisMonth: 0,
      percentageChange: 0
    },
    loading: false,
    error: null
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchStats
      .addCase(fetchStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.stats = action.payload;
        state.loading = false;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      // Handle deleteUser
      .addCase(deleteUserAsync.fulfilled, (state, action) => {
        state.stats.totalUsers -= 1;
      });
  }
});

export default userSlice.reducer;