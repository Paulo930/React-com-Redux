# REACT REDUX

## React Redux

<br>

### **React Redux**

Inicie um aplicativo React e instale o readux e react-redux.

```
  npx create-react-app react-app
```

```
  npm install redux react-redux
```

<br>

### **Provider**

Para podermos ter acesso ao dispatch e a store dentro dos componentes de React, precisamos encapsular todo o applicativo dentro do componente `Provider` que é disponibilizado pelo `react-redux`.

```
// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { Provider } from 'react-redux';
import { createStore } from 'redux';

// Reducer criado da mesma forma
function reducer(state = 0, action) {
  switch (action.type) {
    case 'INCREMENTAR':
      return state + 1;
    default:
      return state;
  }
}

// Importamos diretamente a função createStore do Redux
const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

// Encapsular o <App /> dentro de <Provider /> e passar a store
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
```

<br>

### **useSelector**

O hook `useSelector` é utilizado para termos acesso ao estado do Redux em qualquer local da nossa aplicação.

```
import React from 'react';
import { useSelector } from 'react-redux';

const App = () => {
  // Recebe uma função com o estado
  // podemos retornar um estado específico
  // ex: (state) => state.user;
  const state = useSelector((state) => state);

  return (
    <div>
      <h1>Total: {state}</h1>
    </div>
  );
};

export default App;
```

<br>

### **useDispatch**

O hook `useDispatch` é utilizado para despacharmos ações para a nossa `store`.

```
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const App = () => {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();

  return (
    <div>
      <h1>Total: {state}</h1>
      <button onClick={() => dispatch({ type: 'INCREMENTAR' })}>
        Incrementar
      </button>
    </div>
  );
};

export default App;
```

## Connect

<br>

### **mapStateToProps**

Antes dos hooks, era necessario conectarmos o Redux ao componente para utilizar o estado/dispatch.

```
import React from 'react';
import { connect } from 'react-redux';

const App = ({ contador }) => {
  return (
    <div>
      <h1>Total: {contador}</h1>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { contador: state };
};

// Curried function, o connect() retorna uma função que
// deve ser utilizada para passar o Componente como argumento
export default connect(mapStateToProps)(App);
```

<br>

### **mapDisptachToProps**

Com o mapDispatchToProps não precisamos utilizar o dispatch para dispararmos uma função.

```
// sem o mapDispatchToProps
const App = ({ contador, dispatch }) => {
  return (
    <div>
      <h1>Total: {contador}</h1>
      <button onClick={() => dispatch({ type: 'INCREMENTAR' })}>
        Incrementar
      </button>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { contador: state };
};

export default connect(mapStateToProps)(App);
```

```
// Action Creator
const incrementar = () => ({ type: 'INCREMENTAR' });
```

```
// Não precisamos do dispatch
const App = ({ contador, incrementar }) => {
  return (
    <div>
      <h1>Total: {contador}</h1>
      <button onClick={incrementar}>Incrementar</button>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { contador: state };
};

// É apenas um objeto com uma lista de action creators
const mapDispatchToProps = {
  incrementar,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
```

<br>

### **Diferença**

Não é apenas sintática a diferença entre o uso do connect ou dos hooks. No momento, existe também uma diferença técnica na implementação de como o Redux atualiza os componentes com base na mudança de estado e também na comparação do mesmo.

https://react-redux.js.org/api/hooks

## Redux Toolkit

<br>

### **Instalação**

A equipe do Redux identificou que boa parte do código criado para escrevermos o Redux, é sempre a mesma coisa. Para isso eles criaram um outro pacote (que eles aconselham a utilizar), onde boa parte da repetição como a criação de constantes, action creators, configuração de devtools, immer, redux-thunk e outros já são feitos para você.

O toolkit pode ser utilizado sem o React. Ao instalar o mesmo não é necessário instalar o redux, apenas o react-redux.

```
  npm install @reduxjs/toolkit
```

<br>

### **configureStore**

O `configureStore` automaticamente configura middlewares como o redux-thunk e também a devtools.

```
// configureStore.js
// ao invés de createStore, importamos o configureStore
import { configureStore } from '@reduxjs/toolkit';
import contador from './contador';

// Nela passamos um objeto de configuração que deve
// conter a propriedade reducer
const store = configureStore({ reducer: contador });

export default store;
```

```
// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import store from './store/configureStore';
import { Provider } from 'react-redux';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
```

<br>

### **createAction**

O createAction facilita a criação de ações e constantes com uma única função.

```
// contador.js
import { createAction } from '@reduxjs/toolkit';

export const incrementar = createAction('INCREMENTAR');
export const reduzir = createAction('REDUZIR');

function contador(state = 0, action) {
  switch (action.type) {
    case incrementar.type:
      return state + 1;
    case reduzir.type:
      return state - 1;
    default:
      return state;
  }
}

export default contador;
```

```
// App.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
// posso passar um payload no incrementar(5);
import { incrementar } from './store/contador';

const App = () => {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  return (
    <div>
      <h1>Total: {state}</h1>
      <button onClick={() => dispatch(incrementar())}>Incrementar</button>
    </div>
  );
};

export default App;
```

<br>

### **createSlice**

Aqui está a mágica do toolkit. O `createSlice` irá criar o reducer e as ações utilizando uma única função. Ele também irá definir um `namespace` para as ações e configura automaticamente o immer, permitindo assim a mutação do estado dentro do reducer.

```
import { createSlice } from '@reduxjs/toolkit';

// Recebe um nome, estado inicial e cada ação do reducer
const slice = createSlice({
  name: 'contador',
  initialState: {
    total: 0,
  },
  reducers: {
    incrementar(state) {
      state.total++;
    },
    reduzir(state) {
      state.total--;
    },
  },
});

// Aqui exportamos as ações
export const { incrementar, reduzir } = slice.actions;
export default slice.reducer;
```

```
// É possível também usar os reducers
// da forma tradicional, sem mutação do estado
// basta termos um retorno para as ações
const slice = createSlice({
  name: 'contador',
  initialState: 0,
  reducers: {
    incrementar(state) {
      return state + 1;
    },
    reduzir(state) {
      return state - 1;
    },
  },
});
```

<br>

### **combineReducers**

Vamos utilizar o do toolkit.

```
// configureStore.js
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import contador from './contador';
import modal from './modal';

const reducer = combineReducers({ contador, modal });
const store = configureStore({ reducer });

export default store;
```

```
// modal.js
import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'modal',
  initialState: false,
  reducers: {
    abrir: () => true,
    fechar: () => false,
  },
});

export const { abrir, fechar } = slice.actions;
export default slice.reducer;
```

<br>

### **getDefaultMiddleware**

```
// configureStore.js
import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import logger from './middleware/logger';
import contador from './contador';
import modal from './modal';

const reducer = combineReducers({ contador, modal });
// Existem middlewares já configurados por padrão na store
// para adicionarmos um novo, precisamos puxar os que já existem
// e desestruturarmos os mesmos dentro de uma array.
const middleware = [...getDefaultMiddleware(), logger];

const store = configureStore({ reducer, middleware });

export default store;
```

```
// middleware/logger.js
const logger = (store) => (next) => (action) => {
  console.group(action.type);
  console.log('ACTION', action);
  console.log('PREV_STATE', store.getState());
  const result = next(action);
  console.log('NEW_STATE', store.getState());
  console.groupEnd();
  return result;
};

export default logger;
```

## Async

<br>

### **Async**

O Redux Thunk já é configurado automaticamente através do Toolkit. Podemos definir a ação assíncrona da mesma forma que definimos sem o React, fora do slice.

```
// Login.js
import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'login',
  initialState: {
    loading: false,
    data: null,
    error: null,
  },
  reducers: {
    fetchStarted(state) {
      state.loading = true;
    },
    fetchSuccess(state, action) {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    },
    fetchError(state, action) {
      state.loading = false;
      state.data = null;
      state.error = action.payload;
    },
  },
});

const { fetchStarted, fetchSuccess, fetchError } = slice.actions;

export const fetchToken = (user) => async (dispatch) => {
  try {
    dispatch(fetchStarted());
    const response = await fetch(
      'https://dogsapi.origamid.dev/json/jwt-auth/v1/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      },
    );
    const data = await response.json();
    return dispatch(fetchSuccess(data));
  } catch (error) {
    return dispatch(fetchError(error.message));
  }
};

export default slice.reducer;
```

```
// App.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchToken } from './store/login';

function App() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const { data } = useSelector((state) => state.login);
  const dispatch = useDispatch();

  function handleSubmit(event) {
    event.preventDefault();
    dispatch(fetchToken({ username, password }));
  }

  return (
    <form onSubmit={handleSubmit}>
      <label style={{ display: 'block' }} htmlFor="username">
        Usuário
      </label>
      <input
        id="username"
        type="text"
        value={username}
        onChange={({ target }) => setUsername(target.value)}
      />
      <label style={{ display: 'block' }} htmlFor="password">
        Senha
      </label>
      <input
        id="password"
        type="text"
        value={password}
        onChange={({ target }) => setPassword(target.value)}
      />
      <button onClick={handleSubmit}>Enviar</button>
      <p>{data?.token}</p>
    </form>
  );
}

export default App;
```

<br>

### **Múltiplos Fetch**

A lógica é a mesma para diferentes requisições, modificando apenas os argumentos da função fetch.

```
import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'login',
  initialState: {
    token: {
      loading: false,
      data: null,
      error: null,
    },
    user: {
      loading: false,
      data: null,
      error: null,
    },
  },
  reducers: {
    fetchTokenStarted(state) {
      state.token.loading = true;
    },
    fetchTokenSuccess(state, action) {
      state.token.loading = false;
      state.token.data = action.payload;
      state.token.error = null;
    },
    fetchTokenError(state, action) {
      state.token.loading = false;
      state.token.data = null;
      state.token.error = action.payload;
    },
    fetchUserStarted(state) {
      state.user.loading = true;
    },
    fetchUserSuccess(state, action) {
      state.user.loading = false;
      state.user.data = action.payload;
      state.user.error = null;
    },
    fetchUserError(state, action) {
      state.user.loading = false;
      state.user.data = null;
      state.user.error = action.payload;
    },
  },
});

const {
  fetchTokenStarted,
  fetchTokenSuccess,
  fetchTokenError,
  fetchUserStarted,
  fetchUserSuccess,
  fetchUserError,
} = slice.actions;

export const fetchToken = (user) => async (dispatch) => {
  try {
    dispatch(fetchTokenStarted());
    const response = await fetch(
      'https://dogsapi.origamid.dev/json/jwt-auth/v1/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      },
    );
    const data = await response.json();
    return dispatch(fetchTokenSuccess(data));
  } catch (error) {
    return dispatch(fetchTokenError(error));
  }
};

export const fetchUser = (token) => async (dispatch) => {
  try {
    dispatch(fetchUserStarted());
    const response = await fetch('https://dogsapi.origamid.dev/json/api/user', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
    const data = await response.json();
    return dispatch(fetchUserSuccess(data));
  } catch (error) {
    return dispatch(fetchUserError(error));
  }
};

export const login = (user) => async (dispatch) => {
  try {
    const { payload } = await dispatch(fetchToken(user));
    if (payload.token !== undefined) await dispatch(fetchUser(payload.token));
  } catch (error) {}
};

export default slice.reducer;
```

```
// App.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from './store/login';

function App() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const { data } = useSelector((state) => state.login.user);
  const dispatch = useDispatch();

  function handleSubmit(event) {
    event.preventDefault();
    dispatch(login({ username, password }));
  }

  return (
    <form onSubmit={handleSubmit}>
      <label style={{ display: 'block' }} htmlFor="username">
        Usuário
      </label>
      <input
        id="username"
        type="text"
        value={username}
        onChange={({ target }) => setUsername(target.value)}
      />
      <label style={{ display: 'block' }} htmlFor="password">
        Senha
      </label>
      <input
        id="password"
        type="text"
        value={password}
        onChange={({ target }) => setPassword(target.value)}
      />
      <button onClick={handleSubmit}>Enviar</button>
      <p>{data?.email}</p>
    </form>
  );
}

export default App;
```

## createAsyncSlice

<br>

### **createAsyncSlice**

Toda vez que identificamos um padrão sendo repetido, existe uma oportunidade de otimização do código através de uma função.

```
// importa o createSlice
import { createSlice } from '@reduxjs/toolkit';

/**
 * Cria um slice com uma função assíncrona
 * @param {Object} config
 * @param {String} config.name
 * @param {Object} config.initialState
 * @param {Object} config.reducers
 * @param {Function} config.fetchConfig
 */
const createAsyncSlice = (config) => {
  // cria um slice
  const slice = createSlice({
    // define um nome específico para o slice
    name: config.name,
    // o estado inicial possui propriedades específicas
    // mas podemos adicionar novas / escrever por cima das existentes
    initialState: {
      loading: false,
      data: null,
      error: null,
      ...config.initialState,
    },
    // lista de reducers padrões
    reducers: {
      fetchStarted(state) {
        state.loading = true;
      },
      fetchSuccess(state, action) {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      },
      fetchError(state, action) {
        state.loading = false;
        state.data = null;
        state.error = action.payload;
      },
      // novos reducers caso necessário
      ...config.reducers,
    },
  });

  // desestruturação das ações
  const { fetchStarted, fetchSuccess, fetchError } = slice.actions;
  // ação assíncrona (thunk), recebe um payload
  const asyncAction = (payload) => async (dispatch) => {
    try {
      dispatch(fetchStarted());
      // config.fetchConfig é um método que retorna
      // o url e as opções do fetch
      const { url, options } = config.fetchConfig(payload);
      const response = await fetch(url, options);
      const data = await response.json();
      return dispatch(fetchSuccess(data));
    } catch (error) {
      return dispatch(fetchError(error.message));
    }
  };

  // a função retorna as propriedades de slice e a ação assíncrona
  return { ...slice, asyncAction };
};

export default createAsyncSlice;
```

```
// uso da função
import createAsyncSlice from './helper/createAsyncSlice';

const token = createAsyncSlice({
  name: 'token',
  // fetch precisa ser uma função que retonar um objeto
  fetchConfig: (payload) => ({
    url: 'https://dogsapi.origamid.dev/json/jwt-auth/v1/token',
    options: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  }),
});
```

--

<br>

### **Uso Completo**

```
import { combineReducers } from '@reduxjs/toolkit';
import createAsyncSlice from './helper/createAsyncSlice';

const token = createAsyncSlice({
  name: 'token',
  fetchConfig: (payload) => ({
    url: 'https://dogssapi.origamid.dev/json/jwt-auth/v1/token',
    options: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  }),
});

const user = createAsyncSlice({
  name: 'user',
  fetchConfig: (payload) => ({
    url: 'https://dogsapi.origamid.dev/json/api/user',
    options: {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + payload,
      },
    },
  }),
});

const fetchToken = token.asyncAction;
const fetchUser = user.asyncAction;

export const login = (user) => async (dispatch) => {
  try {
    const { payload } = await dispatch(fetchToken(user));
    if (payload.token !== undefined) await dispatch(fetchUser(payload.token));
  } catch {}
};

const reducer = combineReducers({
  user: user.reducer,
  token: token.reducer,
});

export default reducer;
```

## Prepare

<br>

### **Prepare**

No createSlice, podemos dividir o reducer em 2 métodos, `reducer` e `prepare`. O prepare é utilizado para preparar o objeto criado pela ação. Só é possível retornar através do prepare, as propriedades `{payload, meta, error}`.

```
import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'contador',
  initialState: 0,
  reducers: {
    somar: {
      reducer: (state, action) => state + action.payload,
      prepare(payload) {
        return { payload, meta: 'local' };
      },
    },
  },
});

export const { incrementar, somar } = slice.actions;
export default slice.reducer;
```

## React localStorage

<br>

### **localStorage**

O valor verificado na ação, agora deve estar dentro da propriedade `meta`.

```
// localStorage.js
const localStorage = (store) => (next) => (action) => {
  const response = next(action);
  const { meta } = action;
  if (meta && meta.localStorage) {
    const { key, value } = meta.localStorage;
    window.localStorage.setItem(key, JSON.stringify(value));
  }
  return response;
};

export default localStorage;
```

```
// getLocalStorage.js
function getLocalStorage(key, initial) {
  try {
    return JSON.parse(window.localStorage.getItem(key));
  } catch {
    return initial;
  }
}

export default getLocalStorage;
```

```
const token = createAsyncSlice({
  name: 'token',
  initialState: {
    // Inicia com o dado do localStorage
    data: {
      token: getLocalStorage('token', null),
    },
  },
  reducers: {
    fetchSuccess: {
      reducer(state, action) {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      },
      // salva no localStorage
      prepare(payload) {
        return {
          payload,
          meta: { localStorage: { key: 'token', value: payload.token } },
        };
      },
    },
  },
  fetchConfig: (payload) => ({
    url: 'https://dogsapi.origamid.dev/json/jwt-auth/v1/token',
    options: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  }),
});
```

## React Redux Desafio

<br>

### **React Redux Desafio**

```
// Utilizando os conceitos e funções ensinadas (createAsyncSlice, Thunk, localStorage).
// Crie um mini aplicativo utilizando a API do Dogs.
// Crie um formulário para a autenticação do usuário
// Após o usuário ser autenticado, remova o formulário
// e mostre uma lista com as fotos mais recentes
const api_photos = {
  url: `https://dogsapi.origamid.dev/json/api/photo/?_page=1&_total=3&_user=0`,
  options: {
    method: 'GET',
    cache: 'no-store',
  },
};
// permita que o usuário carregue mais fotos ao clicar em um botão
// crie a funcionalidade de logout
```
