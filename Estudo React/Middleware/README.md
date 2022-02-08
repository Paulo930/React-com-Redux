# MIDDLEWARE

## Currying

<br>

### **Currying**

Uma função `curried` permite passarmos um argumento por vez, ao invés de todos de uma vez.

```
function somar(a, b, c) {
  return a + b + c;
}
somar(2, 5, 10);

function somar_(a) {
  return (b) => {
    return (c) => {
      return a + b + c;
    };
  };
}
// ou const somar_ = a => b => c => a + b + c;
console.log(somar_(2)(5)(10));
```

Uso real, facilitando a composição de funções.

```
<ul>
  <li id="item1" data-slide="1">Teste 1</li>
  <li id="item2" data-slide="2">Teste 2</li>
  <li id="item3" data-slide="3">Teste 3</li>
  <li id="item4" data-slide="4">Teste 4</li>
</ul>
```

```
const getElementAttr = (attr) => (element) => element.getAttribute(attr);
const getAttrDataSlide = getElementAttr('data-slide');
const getAttrId = getElementAttr('id');

const li = Array.from(document.querySelectorAll('li'));

const dataSlideList = li.map(getAttrDataSlide); // ['1', '2', '3', '4'];
const idList = li.map(getAttrId); // ['item1', 'item2', 'item3', 'item4'];
```

## Redux Middleware

<br>

### **applyMiddleware**

O Middleware ocorre entre o momento que a ação é disparada e antes dela chegar ao reducer. Ele é aplicado através da função `Redux.applyMiddleware`.

```
// considere esse reducer para os próximos exemplos
function reducer(state = 0, action) {
  switch (action.type) {
    case 'INCREMENTAR':
      return state + 1;
    case 'REDUZIR':
      return state - 1;
    default:
      return state;
  }
}
```

````
// middleware, recebe store, next e action.
const logger = (store) => (next) => (action) => {
  console.log(action);
  // temos sempre que chamar o next(action), para enviarmos
  // a ação para o próximo middleware (ou reduce se esse for o último)
  return next(action);
};
// Configura o middleware, podemos passar quantos quisermos.
const middleware = Redux.applyMiddleware(logger);

// Passar o middleware como segundo ou tercerio argumento do createStore
// Se o segundo argumento não for uma função, este será considerado
// o estado inicial da aplicação.
const store = Redux.createStore(reducer, middleware);

store.dispatch({ type: 'INCREMENTAR' });
store.dispatch({ type: 'REDUZIR' });
```
````

<br>

### **Compose**

O segundo ou terceiro argumento de createStore é considerado um enhancer. Assim como um middleware, a função do devtools também é um enhancer da store. Para passarmos mais de um, devemos utilizar a função `Redux.compose()`

```
// Desestrutução das funções do Redux (não é necessário, podemos usar Redux.compose)
const { compose, applyMiddleware } = Redux;
// Verifica se __REDUX_DEVTOOLS_EXTENSION__COMPOSE__ existe, se nõa usa o compose puro.
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// Aplica o Middleware com o compose
const enhancer = composeEnhancers(applyMiddleware(logger));
// Utiliza a devTools + middleware como enhancer da store
const store = Redux.createStore(reducer, enhancer);
```

<br>

### **Middleware**

Dentro do Middleware possuímos acesso a store, next e action. Assim podemos ter acesso ao estado atual via `store.getState()` e também podemos despachar ações com `action.dispatch()`.

```
const logger = (store) => (next) => (action) => {
  console.group(action.type);
  console.log('ACTION', action);
  // store.getState antes de next(action), retorna o estado atual
  console.log('PREV_STATE', store.getState());
  const result = next(action);
  // store.getState após next(action), retorna o estado posterior
  console.log('NEW_STATE', store.getState());
  console.groupEnd();
  // temos sempre que retornar o resultado de next(action)
  return result;
};

const action = store.dispatch({ type: 'INCREMENTAR' });
console.log(action);
// {type: 'INCREMENTAR'}, se não retornarmos nada no Middleware, aqui será undefined
```

## Redux Thunk

<br>

### **Operações Assíncronas**

O reducer deve ser uma função pura, sem efeitos colaterais. Por isso não fazemos requisições http diretamente no mesmo.

```
// Errado
function reducer(state = null, action) {
  switch (action.type) {
    case 'FETCH_DATA':
      // fetch é um efeito colateral
      const data = fetch(
        'https://dogsapi.origamid.dev/json/api/photo',
      ).then((r) => r.json());
      // data é uma Promise
      return data;
    default:
      return state;
  }
}

store.dispatch({ type: 'FETCH_DATA' });
```

<br>

### **Fetch**

A função reducer deve apenas modificar o estado. Assim podemos realizar a operação assíncrona por fora do reducer e apenas atualizar o estado de acordo com o momento da operação.

```
function reducer(state = { loading: false, data: null, error: null }, action) {
  switch (action.type) {
    case 'FETCH_STARTED':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { loading: false, data: action.payload, error: null };
    case 'FETCH_ERROR':
      return { loading: false, error: action.payload, data: null };
    default:
      return state;
  }
}

const { compose, applyMiddleware } = Redux;

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// já vamos criar um Middleware, deixe assim por enquanto
const enhancer = composeEnhancers(applyMiddleware());

const store = Redux.createStore(reducer, enhancer);
```

A função abaixo funciona perfeitamente. Mas não vamos utilizar assim, por dois motivos: o primeiro é pelo fato de termos uma função que dispara ações que irão modificar o estado. Por padrão, apenas ações via dispatch devem modificar o estado. O segundo motivo é a necessidade de sempre passar o dispatch como argumento da mesma.

https://stackoverflow.com/questions/34570758/why-do-we-need-middleware-for-async-flow-in-redux

```
async function fetchUrl(dispatch, url) {
  try {
    dispatch({ type: 'FETCH_STARTED' });
    const data = await fetch(url).then((r) => r.json());
    dispatch({ type: 'FETCH_SUCCESS', payload: data });
  } catch (error) {
    dispatch({ type: 'FETCH_ERROR', payload: error.message });
  }
}
fetchUrl(store.dispatch, 'https://dogsapi.origamid.dev/json/api/photo');
```

<br>

### **Redux Thunk**

Podemos utilizar um middleware para contornar a obrigação de sempre enviarmos objetos via dispatch. No middleware podemos identificar a action, e verificar se a mesma é uma função. Caso ela seja uma função podemos ativá-la.

https://github.com/reduxjs/redux-thunk/blob/master/src/index.js

```
// thunk
const thunk = (store) => (next) => (action) => {
  if (typeof action === 'function') {
    return action(store.dispatch, store.getState);
  } else {
    return next(action);
  }
};
```

```
const { compose, applyMiddleware } = Redux;

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancer = composeEnhancers(applyMiddleware(thunk));

const store = Redux.createStore(reducer, enhancer);
```

```
// Action Creator, retorna uma função ao invés de um objeto
function fetchUrl(url) {
  return async (dispatch) => {
    try {
      dispatch({ type: 'FETCH_STARTED' });
      const data = await fetch(url).then((r) => r.json());
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error.message });
    }
  };
}

store.dispatch(fetchUrl('https://dogsapi.origamid.dev/json/api/photo'));
```

## localStorage

<br>

### **localStorage**

Gravar algo no localStorage é um `side-effect`, assim como a manipulação do DOM. Para isso podemos criar um middleware que irá lidar com a situação.

```
// middleware
const localStorage = (store) => (next) => (action) => {
  const response = next(action);
  if (action.localStorage !== undefined)
    window.localStorage.setItem(
      action.localStorage,
      JSON.stringify(action.payload),
    );
  return response;
};
```

Função segura para puxarmos o estado inicial, caso o mesmo exista no localStorage

```
function getLocalStorage(key, initial) {
  try {
    return JSON.parse(window.localStorage.getItem(key));
  } catch (error) {
    return initial;
  }
}

const initialState = {
  token: getLocalStorage('token', null),
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_TOKEN':
      return { token: action.payload };
    default:
      return state;
  }
}

const { compose, applyMiddleware } = Redux;
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancer = composeEnhancers(applyMiddleware(localStorage));
const store = Redux.createStore(reducer, enhancer);
```

O objeto da ação despachada pode conter quantas propriedades quisermos. O redux não obriga nenhum padrão, além do uso do type. O redux é inspirado no padrão flux, esse sim recomenda que o objeto tenha apenas, type, payload, error e meta (em meta seria o local ideal para informarmos se a informação deve ser salva no localStorage).

```
store.dispatch({
  type: 'SET_TOKEN',
  payload: 'xxxx-xxxx',
  localStorage: 'token',
});
```

## Middleware Desafio

<br>

### **Desafio**

```
// Organize o código em diferentes arquivos com type module
// Crie 2 reducers, token e user
// Ações:
// token/FETCH_STARTED, token/FETCH_SUCCESS, token/FETCH_ERROR
// user/FETCH_STARTED, user/FETCH_SUCCESS, user/FETCH_ERROR
// Crie constantes e action creators para cada ação
// Crie middlewares: Thunk e localStorage
// Com a api do curso de React, puxe o token:
// o user pode ser { username: 'dog', password: 'dog' }
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
const { token } = await response.json();

// Com a api do curso de React, puxe o usuário:
const response = await fetch('https://dogsapi.origamid.dev/json/api/user', {
  method: 'GET',
  headers: {
    Authorization: 'Bearer ' + token,
  },
});
const data = await response.json();

// A api deve ir dentro da action creator das funções assíncronas
// Verifique se o token existe, caso exista dispare imediatamente
// a função para puxar o usuário. Se não existir, dispare a
// função para puxar o token e em seguida para puxar o usuário
```

<br>

### **Solução**

```
- index.html
- script.js
• store
  - configureStore.js
  - token.js
  - user.js
  • middleware
    - thunk.js
    - localStorage.js
  • helper
    - getLocalStorage.js
```

```
// configureStore.js
const { applyMiddleware, compose, combineReducers, createStore } = Redux;
import thunk from './middleware/thunk.js';
import localStorage from './middleware/localStorage.js';
import token from './token.js';
import user from './user.js';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancer = composeEnhancers(applyMiddleware(thunk, localStorage));
const reducer = combineReducers({ token, user });
const store = createStore(reducer, enhancer);

export default store;
```

```
// token.js
import getLocalStorage from './helper/getLocalStorage.js';

// Constants
const TOKEN_FETCH_STARTED = 'token/FETCH_STARTED';
const TOKEN_FETCH_SUCCESS = 'token/FETCH_SUCCESS';
const TOKEN_FETCH_ERROR = 'token/FETCH_ERROR';

// Sync Actions
export const tokenFetchStarted = () => ({ type: TOKEN_FETCH_STARTED });
export const tokenFetchSuccess = (payload) => ({
  type: TOKEN_FETCH_SUCCESS,
  payload,
  localStorage: 'token',
});
export const tokenFetchError = (payload) => ({
  type: TOKEN_FETCH_ERROR,
  payload,
});

export const tokenFetch = (body) => async (dispatch) => {
  try {
    dispatch(tokenFetchStarted());
    const response = await fetch(
      'https://dogsapi.origamid.dev/json/jwt-auth/v1/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    );
    const { token } = await response.json();
    dispatch(tokenFetchSuccess(token));
  } catch (error) {
    dispatch(tokenFetchError(error.message));
  }
};

// Initial State
const initialState = {
  loading: false,
  data: getLocalStorage('token', null),
  error: null,
};

// Reducer
function token(state = initialState, action) {
  switch (action.type) {
    case TOKEN_FETCH_STARTED:
      return { ...state, loading: true };
    case TOKEN_FETCH_SUCCESS:
      return { data: action.payload, loading: false, error: null };
    case TOKEN_FETCH_ERROR:
      return { data: null, loading: false, error: action.payload };
    default:
      return state;
  }
}

export default token;
```

```
// user.js
// Constants
const USER_FETCH_STARTED = 'user/FETCH_STARTED';
const USER_FETCH_SUCCESS = 'user/FETCH_SUCCESS';
const USER_FETCH_ERROR = 'user/FETCH_ERROR';

// Sync Actions
export const userFetchStarted = () => ({ type: USER_FETCH_STARTED });
export const userFetchSuccess = (payload) => ({
  type: USER_FETCH_SUCCESS,
  payload,
});
export const userFetchError = (payload) => ({
  type: USER_FETCH_ERROR,
  payload,
});

// Async Actions
export const userFetch = (token) => async (dispatch) => {
  try {
    dispatch(userFetchStarted());
    const response = await fetch('https://dogsapi.origamid.dev/json/api/user', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
    const data = await response.json();
    dispatch(userFetchSuccess(data));
  } catch (error) {
    dispatch(userFetchError(error.message));
  }
};

// Initial State
const initialState = {
  loading: false,
  data: null,
  error: null,
};

// Reducer
function user(state = initialState, action) {
  switch (action.type) {
    case USER_FETCH_STARTED:
      return { ...state, loading: true };
    case USER_FETCH_SUCCESS:
      return { data: action.payload, loading: false, error: null };
    case USER_FETCH_ERROR:
      return { data: null, loading: false, error: action.payload };
    default:
      return state;
  }
}

export default user;
```

```
// thunk.js
const thunk = (store) => (next) => (action) => {
  if (typeof action === 'function') {
    return action(store.dispatch, store.getState);
  }
  return next(action);
};

export default thunk;
```

```
// localStorage.js
const localStorage = (store) => (next) => (action) => {
  const result = next(action);
  if (action.localStorage !== undefined) {
    window.localStorage.setItem(
      action.localStorage,
      JSON.stringify(action.payload),
    );
  }
  return result;
};

export default localStorage;
```

```
// getLocalStorage.js
function getLocalStorage(key, initial) {
  try {
    return JSON.parse(window.localStorage.getItem(key));
  } catch (error) {
    return initial;
  }
}

export default getLocalStorage;
```

```
// script.js
import store from './store/configureStore.js';
import { tokenFetch } from './store/token.js';
import { userFetch } from './store/user.js';

const login = async (user) => {
  let state = store.getState();
  if (state.token.data === null) {
    await store.dispatch(tokenFetch(user));
  }
  state = store.getState();
  await store.dispatch(userFetch(state.token.data));
};

login({ username: 'dog', password: 'dog' });
```
