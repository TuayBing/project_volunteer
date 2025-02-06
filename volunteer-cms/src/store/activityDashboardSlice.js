import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/axios';

// Async Thunks
export const fetchActivityDashboardStats = createAsyncThunk(
 'activityDashboard/fetchStats',
 async () => {
   try {
     const response = await api.get('/profile/activities');
     return response.data.data;
   } catch (error) {
     throw error;
   }
 }
);

export const updateActivityStatusThunk = createAsyncThunk(
  'activityDashboard/updateStatus',
  async ({ activityId, newStatus }, { dispatch }) => {
    try {
      // 1. อัพเดทสถานะกิจกรรม
      const response = await api.patch(`/profile/activities/${activityId}/status`, {
        status: newStatus
      });

      if (response.data.success) {
        // 2. ถ้าสถานะเป็น "สำเร็จ" ให้อัพเดทจำนวนชั่วโมง
        if (newStatus === 'สำเร็จ') {
          // อัพเดทจำนวนชั่วโมงใน student_details
          await api.patch('/user/total-hours');
        }

        // 3. ดึงข้อมูลกิจกรรมและสถิติใหม่
        await dispatch(fetchActivityDashboardStats());
        return { activityId, newStatus };
      }
    } catch (error) {
      throw error;
    }
  }
);

// Helper function for calculating stats
const calculateStats = (activities) => {
 return activities.reduce((acc, registration) => {
   const status = registration.status;
   const hours = registration.activity?.hours || 0;

   if (status === 'สำเร็จ') {
     acc.completedActivities += 1;
     acc.totalHours += hours;
   } else if (status === 'กำลังดำเนินการ') {
     acc.inProgressActivities += 1;
   } else if (status === 'ยกเลิก') {
     acc.expiredActivities += 1;
   }

   return acc;
 }, {
   totalActivities: activities.length,
   completedActivities: 0,
   inProgressActivities: 0,
   expiredActivities: 0,
   totalHours: 0
 });
};

const initialState = {
 activities: [],
 stats: {
   totalActivities: 0,
   completedActivities: 0,
   inProgressActivities: 0,
   expiredActivities: 0,
   totalHours: 0
 },
 yearRange: '',
 loading: false,
 error: null
};

const activityDashboardSlice = createSlice({
 name: 'activityDashboard',
 initialState,
 reducers: {
   setYearRange: (state, action) => {
     state.yearRange = action.payload;
   }
 },
 extraReducers: (builder) => {
   builder
     // Fetch Stats Cases
     .addCase(fetchActivityDashboardStats.pending, (state) => {
       state.loading = true;
       state.error = null;
     })
     .addCase(fetchActivityDashboardStats.fulfilled, (state, action) => {
       state.loading = false;
       state.activities = action.payload;
       state.stats = calculateStats(action.payload);
     })
     .addCase(fetchActivityDashboardStats.rejected, (state, action) => {
       state.loading = false;
       state.error = action.error.message;
     })
     // Update Status Cases
     .addCase(updateActivityStatusThunk.pending, (state) => {
       state.loading = true;
       state.error = null;
     })
     .addCase(updateActivityStatusThunk.fulfilled, (state, action) => {
       state.loading = false;
       if (action.payload) {
         const { activityId, newStatus } = action.payload;
         // อัพเดทสถานะในรายการกิจกรรม
         state.activities = state.activities.map(activity =>
           activity.id === activityId
             ? { ...activity, status: newStatus }
             : activity
         );
         // คำนวณสถิติใหม่
         state.stats = calculateStats(state.activities);
       }
     })
     .addCase(updateActivityStatusThunk.rejected, (state, action) => {
       state.loading = false;
       state.error = action.error.message;
     });
 }
});

// Actions
export const { setYearRange } = activityDashboardSlice.actions;

// Selectors
export const selectStats = (state) => state.activityDashboard.stats;
export const selectLoading = (state) => state.activityDashboard.loading;
export const selectError = (state) => state.activityDashboard.error;
export const selectYearRange = (state) => state.activityDashboard.yearRange;
export const selectActivities = (state) => state.activityDashboard.activities;

export default activityDashboardSlice.reducer;