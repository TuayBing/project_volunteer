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
      console.error('Fetch activities error:', error);
      throw error;
    }
  }
);

// Add activity
export const addActivity = createAsyncThunk(
  'activities/addActivity',
  async (activityData) => {
    try {
      const response = await axios.post('/activities', activityData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        try {
          await axios.post('/notifications/activity', {
            id: response.data.data.id,
            name: response.data.data.name
          }, {
            timeout: 10000
          });
        } catch (notificationError) {
          console.warn('Notification may be delayed:', {
            activityId: response.data.data.id,
            error: notificationError.message
          });
        }
      } else {
        throw new Error(response.data.message || 'การเพิ่มกิจกรรมไม่สำเร็จ');
      }

      return response.data;
    } catch (error) {
      console.error('Add activity error:', error);
      throw error;
    }
  }
);

// Update activity 
export const updateActivity = createAsyncThunk(
  'activities/updateActivity',
  async ({ id, formData }) => {
    try {
      // Log data being sent
      console.log('Updating activity:', {
        id,
        formData: Object.fromEntries(formData.entries())
      });

      const response = await axios.put(`/activities/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'การอัพเดทไม่สำเร็จ');
      }

      return response.data;
    } catch (error) {
      console.error('Update activity error:', error);
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
      const response = await axios.delete(`/activities/${activityId}`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'การลบไม่สำเร็จ');
      }

      return activityId;
    } catch (error) {
      console.error('Delete activity error:', error);
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
        state.error = null;
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
        state.error = null;
      })
      .addCase(addActivity.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // ถ้ามีข้อมูลกิจกรรมใหม่ใน response
        if (action.payload.data) {
          state.list.push(action.payload.data);
        }
        state.error = null;
      })
      .addCase(addActivity.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'เกิดข้อผิดพลาดในการสร้างกิจกรรม';
      })

      // Update activity
      .addCase(updateActivity.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateActivity.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // อัพเดทข้อมูลในรายการ
        if (action.payload.data) {
          const updatedActivity = action.payload.data;
          const index = state.list.findIndex(activity => activity.id === updatedActivity.id);
          if (index !== -1) {
            state.list[index] = updatedActivity;
          }
        }
        state.error = null;
      })
      .addCase(updateActivity.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error?.message || 
                     action.payload?.message || 
                     'เกิดข้อผิดพลาดในการอัพเดทกิจกรรม';
      })

      // Delete activity
      .addCase(deleteActivity.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteActivity.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // ลบกิจกรรมออกจากรายการ
        state.list = state.list.filter(activity => activity.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteActivity.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error?.message || 
                     action.payload?.message || 
                     'เกิดข้อผิดพลาดในการลบกิจกรรม';
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