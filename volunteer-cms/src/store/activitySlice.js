import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../utils/axios';

// Fetch activities
export const fetchActivities = createAsyncThunk(
 'activities/fetchActivities',
 async () => {
   try {
     const response = await axios.get('/activities');
     return response.data;
   } catch (error) {
     throw error;
   }
 }
);

// Add activity
export const addActivity = createAsyncThunk(
  'activities/addActivity',
  async (activityData) => {
    try {
      // เพิ่มกิจกรรม
      const response = await axios.post('/activities', activityData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        // เรียก API สร้างการแจ้งเตือนพร้อม timeout
        try {
          await axios.post('/notifications/activity', {
            id: response.data.data.id,
            name: response.data.data.name
          }, {
            timeout: 10000 // เพิ่มเป็น 10 วินาที
          });
        } catch (notificationError) {
          // เปลี่ยนเป็น warning แทน error
          console.warn('Notification may be delayed:', {
            activityId: response.data.data.id,
            error: notificationError.message
          });
        }
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

// Update activity 
export const updateActivity = createAsyncThunk(
 'activities/updateActivity',
 async ({ id, ...formData }) => {
   try {
     const response = await axios.put(`/activities/${id}`, formData, {
       headers: {
         'Content-Type': 'multipart/form-data'
       }
     });
     return response.data;
   } catch (error) {
     throw {
       message: error.response?.data?.message || 'เกิดข้อผิดพลาดในการอัพเดทกิจกรรม',
       status: error.response?.status,
       originalError: error
     };
   }
 }
);

// Delete activity
export const deleteActivity = createAsyncThunk(
 'activities/deleteActivity',
 async (activityId) => {
   try {
     await axios.delete(`/activities/${activityId}`);
     return activityId;
   } catch (error) {
     throw {
       message: error.response?.data?.message || 'เกิดข้อผิดพลาดในการลบกิจกรรม',
       status: error.response?.status,
       originalError: error
     };
   }
 }
);

const activitySlice = createSlice({
 name: 'activities',
 initialState: {
   list: [],
   status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
   error: null,
 },
 reducers: {
   clearActivities: (state) => {
     state.list = [];
     state.status = 'idle';
     state.error = null;
   },
   setIdle: (state) => {
     state.status = 'idle';
   }
 },
 extraReducers: (builder) => {
   builder
     // Fetch activities
     .addCase(fetchActivities.pending, (state) => {
       state.status = 'loading';
     })
     .addCase(fetchActivities.fulfilled, (state, action) => {
       state.status = 'succeeded';
       state.list = action.payload.data;
       state.error = null;
     })
     .addCase(fetchActivities.rejected, (state, action) => {
       state.status = 'failed';
       state.error = action.error.message;
     })

     // Add activity
     .addCase(addActivity.pending, (state) => {
       state.status = 'loading';
     })
     .addCase(addActivity.fulfilled, (state, action) => {
       state.status = 'succeeded';
       state.error = null;
       // อัพเดทสถานะเพื่อให้ component ดึงข้อมูลใหม่
       state.status = 'idle';
     })
     .addCase(addActivity.rejected, (state, action) => {
       state.status = 'failed';
       state.error = action.error.message || 'เกิดข้อผิดพลาดในการสร้างกิจกรรม';
     })

     // Update activity
     .addCase(updateActivity.pending, (state) => {
       state.status = 'loading';
     })
     .addCase(updateActivity.fulfilled, (state, action) => {
       state.status = 'succeeded';
       state.error = null;
       state.status = 'idle';
     })
     .addCase(updateActivity.rejected, (state, action) => {
       state.status = 'failed';
       state.error = action.error.message || 'เกิดข้อผิดพลาดในการอัพเดทกิจกรรม';
     })

     // Delete activity
     .addCase(deleteActivity.pending, (state) => {
       state.status = 'loading';
     })
     .addCase(deleteActivity.fulfilled, (state, action) => {
       state.status = 'succeeded';
       state.error = null;
       state.status = 'idle';
     })
     .addCase(deleteActivity.rejected, (state, action) => {
       state.status = 'failed';
       state.error = action.error.message || 'เกิดข้อผิดพลาดในการลบกิจกรรม';
     });
 },
});

// Export actions
export const { clearActivities, setIdle } = activitySlice.actions;

// Export selectors
export const selectActivities = (state) => state.activities.list;
export const selectActivityStatus = (state) => state.activities.status;
export const selectActivityError = (state) => state.activities.error;
export const selectActivityById = (state, activityId) =>
 state.activities.list.find(activity => activity.id === activityId);

export default activitySlice.reducer;