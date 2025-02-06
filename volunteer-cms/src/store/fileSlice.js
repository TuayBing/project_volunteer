import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  files: [],
  isLoading: false,
  deleteModalOpen: false,
  fileToDelete: null
};

const fileSlice = createSlice({
  name: 'file',
  initialState,
  reducers: {
    setFiles: (state, action) => {
      state.files = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setDeleteModal: (state, action) => {
      state.deleteModalOpen = action.payload;
    },
    setFileToDelete: (state, action) => {
      state.fileToDelete = action.payload;
    }
  }
});

export const { setFiles, setLoading, setDeleteModal, setFileToDelete } = fileSlice.actions;
export default fileSlice.reducer;