import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
  type: null,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state) => {
      state.isOpen = true;
      state.type = null;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.type = null;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
