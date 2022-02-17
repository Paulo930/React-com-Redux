import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'date',
  initialState: {
    formData: {},
  },
  reducers: {
    adicionarDatas(state, action) {
      state.formData = action.payload;
    },
  },
});

export const { adicionarDatas } = slice.actions;

export default slice.reducer;
