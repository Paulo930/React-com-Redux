import React from 'react';
import App from './App';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

function reducer(state = 0, action) {
  switch (action.type) {
    case 'INCREMENTAR':
      return state + 1;
    default:
      return state;
  }
}

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default Root;
