import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../utils/axios';

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async () => {
    try {
      const response = await axios.get('/category/categories');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const addCategory = createAsyncThunk(
  'categories/addCategory',
  async (name) => {
    try {
      const response = await axios.post('/category/categories', { name });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, name }) => {
    try {
      const response = await axios.put(`/category/categories/${id}`, { name });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id) => {
    try {
      await axios.delete(`/category/categories/${id}`);
      return id;
    } catch (error) {
      throw error;
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    list: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    clearCategories: (state) => {
      state.list = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload.data;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Add category
      .addCase(addCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.status = 'idle'; // เซ็ต idle เพื่อทริกเกอร์การโหลดใหม่
        state.error = null;
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Update category
      .addCase(updateCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.status = 'idle'; // เซ็ต idle เพื่อทริกเกอร์การโหลดใหม่
        state.error = null;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Delete category
      .addCase(deleteCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.status = 'idle'; // เซ็ต idle เพื่อทริกเกอร์การโหลดใหม่
        state.error = null;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { clearCategories } = categorySlice.actions;

// Selectors
export const selectCategories = (state) => state.categories.list;
export const selectCategoryStatus = (state) => state.categories.status;
export const selectCategoryError = (state) => state.categories.error;

export default categorySlice.reducer;