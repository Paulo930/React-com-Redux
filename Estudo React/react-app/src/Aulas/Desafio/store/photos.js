import createAsyncSlice from '../helper/createAsyncSlice';

const slice = createAsyncSlice({
  name: 'photos',
  initialState: {
    data: [],
  },
  reducers: {},
});

export const { asyncAction } = slice.actions;
export default slice.reducer;
