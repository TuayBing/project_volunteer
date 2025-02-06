import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isModalOpen: false,
  formData: {
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: 'admin',
    gender: '',
    faculty: '',
    major: '',
  },
  // เพิ่ม state สำหรับ loading และ error
  loading: false,
  error: null
};

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    // Modal actions
    openModal: (state) => {
      state.isModalOpen = true;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
      state.formData = initialState.formData;
      state.error = null;
    },
    // Form actions
    updateFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    resetForm: (state) => {
      state.formData = initialState.formData;
    },
    // Loading state actions
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    // Error handling actions
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

// Export actions
export const {
  openModal,
  closeModal,
  updateFormData,
  resetForm,
  setLoading,
  setError,
  clearError
} = adminSlice.actions;

// Selectors
export const selectIsModalOpen = (state) => state.admin.isModalOpen;
export const selectFormData = (state) => state.admin.formData;
export const selectLoading = (state) => state.admin.loading;
export const selectError = (state) => state.admin.error;

export default adminSlice.reducer;