import { PHOTO_GET } from '../api';

const FETCH_PHOTO_STARTED = 'photo/FETCH_PHOTO_STARTED';
const FETCH_PHOTO_SUCCESS = 'photo/FETCH_PHOTO_SUCCESS';
const FETCH_PHOTO_ERROR = 'photo/FETCH_PHOTO_ERROR';

export const fetchPhotosStarted = () => ({ type: FETCH_PHOTO_STARTED });

export const fetchPhotosSuccess = (data) => ({
  type: FETCH_PHOTO_SUCCESS,
  payload: data,
});

export const fetchPhotosError = (error) => ({
  type: FETCH_PHOTO_ERROR,
  payload: error,
});

const initialState = {
  loading: false,
  error: null,
  data: null,
};

export default function photo(state = initialState, action) {
  switch (action.type) {
    case FETCH_PHOTO_STARTED:
      return { ...state, loading: true, error: null, data: null };
    case FETCH_PHOTO_SUCCESS:
      return { ...state, loading: false, error: null, data: action.payload };
    case FETCH_PHOTO_ERROR:
      return { ...state, loading: false, error: action.payload, data: null };
    default:
      return state;
  }
}

export const fetchPhoto = (id) => async (dispatch) => {
  try {
    dispatch(fetchPhotosStarted());
    const { url, options } = PHOTO_GET(id);
    const response = await fetch(url, options);
    const data = await response.json();
    if (response.ok === false) throw new Error(data.message);
    return dispatch(fetchPhotosSuccess(data));
  } catch (error) {
    return dispatch(fetchPhotosError(error.message));
  }
};
