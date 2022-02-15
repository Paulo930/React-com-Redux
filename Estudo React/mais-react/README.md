# MAIS REDUX

## Onde Utilizar

<br>

### **Exemplos**

- https://www.revolut.com/

- https://www.airbnb.ie/

- https://www.reddit.com/

> Pode ser que eles desabilitem o devtools ou o uso do Redux após o vídeo ter sido gravado.

<br>

### **Global vs Local**

- Estado Global vai no Redux

- Estado Local pode ou não ir

- Evite colocar estados locais que mudam frequentemente

Estado de formulários, tamanho da tela, posição do scroll e etc.

## Formulário

<br>

### **Formulário**

O estado do campo de formulário geralmente será gerenciado localmente. Porém podemos despachar o estado para o Redux caso o mesmo seja necessário para utilizarmos globalmente.

```
// date.js
import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'date',
  initialState: {
    partida: '',
    retorno: '',
  },
  reducers: {
    adicionarDatas(state, action) {
      state.partida = action.payload.partida;
      state.retorno = action.payload.retorno;
    },
  },
});

export const { adicionarDatas } = slice.actions;

export default slice.reducer;
```

```
// configureStore.js
import { configureStore } from '@reduxjs/toolkit';
import date from './date';

const store = configureStore({ reducer: date });

export default store;
```

```
// App.js
import React from 'react';
import { useDispatch } from 'react-redux';
import { adicionarDatas } from './store/date';

function App() {
  const [partida, setPartida] = React.useState('');
  const [retorno, setRetorno] = React.useState('');
  const dispatch = useDispatch();

  function handleSubmit(event) {
    event.preventDefault();
    dispatch(adicionarDatas({ partida, retorno }));
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="partida">Partida</label>
      <input
        id="partida"
        type="date"
        value={partida}
        onChange={({ target }) => setPartida(target.value)}
      />
      <label htmlFor="retorno">Retorno</label>
      <input
        id="retorno"
        type="date"
        value={retorno}
        onChange={({ target }) => setRetorno(target.value)}
      />
      <button>Buscar</button>
    </form>
  );
}

export default App;
```

<br>

### **Formulário Completo**

Podemos enviar também todos os dados do formulário para a store.

```
import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'form',
  initialState: {
    data: null,
  },
  reducers: {
    addFormData(state, action) {
      state.data = action.payload;
    },
  },
});

export const { addFormData } = slice.actions;

export default slice.reducer;
```

```
import React from 'react';
import { useDispatch } from 'react-redux';
import { addFormData } from './store/form';

const UserForm = () => {
  const [nome, setNome] = React.useState('');
  const [sobrenome, setSobrenome] = React.useState('');
  const [endereco, setEndereco] = React.useState('');
  const [email, setEmail] = React.useState('');

  const dispatch = useDispatch();
  addFormData();

  function handleSubmit(event) {
    event.preventDefault();
    dispatch(addFormData({ nome, sobrenome, endereco, email }));
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="nome"
        value={nome}
        onChange={({ target }) => setNome(target.value)}
      />
      <input
        type="text"
        placeholder="sobrenome"
        value={sobrenome}
        onChange={({ target }) => setSobrenome(target.value)}
      />
      <input
        type="text"
        placeholder="endereco"
        value={endereco}
        onChange={({ target }) => setEndereco(target.value)}
      />
      <input
        type="text"
        placeholder="email"
        value={email}
        onChange={({ target }) => setEmail(target.value)}
      />
      <button>Enviar</button>
    </form>
  );
};

export default UserForm;
```

## Cache

<br>

### **Cache**

Podemos criar um estado interno que controle se uma ação assíncrona deve ser despachada ou não, baseado no tempo em que a mesma foi despachada.

```
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
  const slice = createSlice({
    name: config.name,
    initialState: {
      loading: false,
      data: null,
      error: null,
      lastUpdate: 0,
      cache: 60000,
      ...config.initialState,
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
      updateTime(state, action) {
        state.lastUpdate = action.payload;
      },
      ...config.reducers,
    },
  });

  const { fetchStarted, fetchSuccess, fetchError, updateTime } = slice.actions;

  const asyncAction = (payload) => async (dispatch, getState) => {
    // Verifica se o último update é maior que o tempo atual - cache
    const { lastUpdate, cache } = getState()[slice.name];
    if (lastUpdate > Date.now() - cache) return;
    try {
      dispatch(fetchStarted());
      const { url, options } = config.fetchConfig(payload);
      const response = await fetch(url, options);
      const data = await response.json();
      dispatch(updateTime(Date.now()));
      return dispatch(fetchSuccess(data));
    } catch (error) {
      return dispatch(fetchError(error.message));
    }
  };

  return { ...slice, asyncAction };
};

export default createAsyncSlice;
```

```
import createAsyncSlice from './helper/createAsyncSlice';

const slice = createAsyncSlice({
  name: 'photos',
  // Podemos modificar o valor padrão
  initialState: {
    cache: 2000,
  },
  fetchConfig: () => ({
    url:
      'https://dogsapi.origamid.dev/json/api/photo/?_page=1&_total=6&_user=0',
    options: {
      method: 'GET',
      cache: 'no-store',
    },
  }),
});

export const fetchPhotos = slice.asyncAction;

export default slice.reducer;
```

```
// App.js
import React from 'react';
import './App.css';
import Photos from './Photos';

function App() {
  const [toggle, setToggle] = React.useState(true);
  return (
    <div>
      <button onClick={() => setToggle(!toggle)}>Toggle Photos</button>
      {toggle && <Photos />}
    </div>
  );
}

export default App;
```

```
// Photos.js
import React from 'react';
import { fetchPhotos } from './store/photos';
import { useDispatch, useSelector } from 'react-redux';

const Photos = () => {
  const { data } = useSelector((state) => state.photos);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchPhotos());
  }, [dispatch]);

  if (!data) return null;
  return (
    <div>
      {data.map((photo) => (
        <li key={photo.id}>{photo.title}</li>
      ))}
    </div>
  );
};

export default Photos;
```

## Selector

<br>

### **Selector**

O seletor é uma função que podemos utilizar diretamente no useSelector para retornar exatamente os dados da store que precisamos. Usamos um seletor quando precisamos selecionar dados específicos sem a necessidade de modificarmos o dados do estado.

```
export const getOverFiveKg = (state) =>
  state.photos.data?.filter(({ peso }) => peso >= 5);
```

```
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPhotos } from './store/photos';
import { getOverFiveKg } from './store/photos';

const Photos = () => {
  const data = useSelector(getOverFiveKg);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchPhotos());
  }, [dispatch]);

  if (!data) return null;
  return (
    <div>
      {data.map((photo) => (
        <li key={photo.id}>
          {photo.title} | {photo.peso}
        </li>
      ))}
    </div>
  );
};

export default Photos;
```

```
// O seletor pode retornar dados transformados
export const getOverFiveKg = (state) => {
  const { data } = state.photos;
  const overFiveKg = data?.filter(({ peso }) => peso >= 5);
  const transformPound = overFiveKg?.map((photo) => ({
    ...photo,
    peso: Math.floor(photo.peso * 2.2),
  }));
  return transformPound;
};
```

## Filtros

<br>

### **Filtros**

Com o uso de seletores podemos filtrar os dados da nossa store sem modificarmos os valores iniciais.

```
// data.js
export default [
  {
    id: 1,
    name: 'Camiseta',
    color: 'azul',
    price: 25,
  },
  {
    id: 2,
    name: 'Camiseta',
    color: 'preta',
    price: 25,
  },
  {
    id: 3,
    name: 'Bermuda',
    color: 'preta',
    price: 35,
  },
  {
    id: 4,
    name: 'Saia',
    color: 'preta',
    price: 22,
  },
  {
    id: 5,
    name: 'Camisa Polo',
    color: 'azul',
    price: 42,
  },
  {
    id: 6,
    name: 'Vestido',
    color: 'azul',
    price: 60,
  },
  {
    id: 7,
    name: 'Camisa',
    color: 'rosa',
    price: 30,
  },
];
```

```
// store/products.js
import { createSlice } from '@reduxjs/toolkit';
import data from '../data';

const slice = createSlice({
  name: 'products',
  initialState: {
    data,
    filters: {
      colors: [],
      prices: {
        max: 0,
        min: 0,
      },
    },
  },
  reducers: {
    changeFilters(state, action) {
      state.filters[action.payload.name] = action.payload.value;
    },
  },
});

export const { changeFilters } = slice.actions;

// Seletores com diferentes filtros
export const selectUniqueColors = ({ products }) =>
  Array.from(new Set(products.data.map(({ color }) => color)));

// Composição de funções
const filterColors = (colors) => (product) =>
  !colors.length || colors.includes(product.color);

const filterPrices = (prices) => (product) =>
  (!prices.max || product.price < prices.max) &&
  (!prices.min || product.price > prices.min);

export const filterProducts = ({ products }) => {
  const { filters, data } = products;
  return data
    .filter(filterColors(filters.colors))
    .filter(filterPrices(filters.prices));
};

export default slice.reducer;
```

```
// Products.js
import React from 'react';
import { useSelector } from 'react-redux';
import { filterProducts } from './store/products';

const Products = () => {
  // A lógica fica concentrada na store, e os componentes são
  // utilizados mais como uma camada de apresentação
  const data = useSelector(filterProducts);

  return (
    <table>
      <thead>
        <tr>
          <th>nome</th>
          <th>cor</th>
          <th>preco</th>
        </tr>
      </thead>
      <tbody>
        {data.map(({ id, name, color, price }) => (
          <tr key={id}>
            <td>{name}</td>
            <td>{color}</td>
            <td>R$ {price}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Products;
```

```
// Filters.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeFilters, selectUniqueColors } from './store/products';

const Filter = () => {
  const dispatch = useDispatch();
  const colors = useSelector(selectUniqueColors);
  const [selectedColors, setSelectedColors] = React.useState([]);
  const [minPrice, setMinPrice] = React.useState('');
  const [maxPrice, setMaxPrice] = React.useState('');

  React.useEffect(() => {
    dispatch(changeFilters({ name: 'colors', value: selectedColors }));
  }, [selectedColors, dispatch]);

  // Disparamos a ação sempre que o valor de min e max mudam
  React.useEffect(() => {
    dispatch(
      changeFilters({
        name: 'prices',
        value: { min: Number(minPrice), max: Number(maxPrice) },
      }),
    );
  }, [minPrice, maxPrice, dispatch]);

  // Lógica ensinada no curso de React para lidarmos com checkbox
  function handleChange({ target }) {
    if (target.checked) {
      setSelectedColors([...selectedColors, target.value]);
    } else {
      setSelectedColors(
        selectedColors.filter((color) => color !== target.value),
      );
    }
  }

  function handleChecked(color) {
    return selectedColors.includes(color);
  }

  return (
    <form>
      <input
        type="number"
        value={minPrice}
        onChange={({ target }) => setMinPrice(target.value)}
        placeholder="Min"
      />
      <input
        type="number"
        value={maxPrice}
        onChange={({ target }) => setMaxPrice(target.value)}
        placeholder="Max"
      />
      {colors.map((color) => (
        <label key={color}>
          <input
            type="checkbox"
            value={color}
            checked={handleChecked(color)}
            onChange={handleChange}
          />
          {color}
        </label>
      ))}
    </form>
  );
};

export default Filter;
```

```
// store/configureStore.js
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import products from './products';

const reducer = combineReducers({ products });
const store = configureStore({ reducer });

export default store;
```

## Resumo React Redux

<br>

### **1 - Instalar**

```
  npx create-react-app app
```

```
  npm install redux react-redux @reduxjs/toolkit
```

<br>

### **2 - configureStore**

```
// /store/configureStore.js
import { combineReducers, configureStore } from '@reduxjs/toolkit';

// reducer mínimo para teste
const contador = () => 0;

const reducer = combineReducers({ contador });
const store = configureStore({ reducer });

export default store;
```

<br>

### **3 - Provider**

Adicionar a store ao aplicativo utilizando o `Provider` do `react-redux`.

```
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store/configureStore';
import App from './App';

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

### **4 - Reducer**

Criar um Reducer, exportar o mesmo e importar no configureStore.

```
// store/contador.js
import { createSlice } from '@reduxjs/toolkit';

// Se o initialState não for um Objeto ou Array,
// é necessário retornar o estado sem mutar o mesmo
const slice = createSlice({
  name: 'contador',
  initialState: 0,
  reducers: {
    incrementar: (state) => state + 1,
    reduzir: (state) => state - 1,
  },
});

export const { incrementar, reduzir } = slice.actions;
export default slice.reducer;
```

```
// store/configureStore.js
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import contador from './contador';

const reducer = combineReducers({ contador });
const store = configureStore({ reducer });

export default store;
```

<br>

### **5 - useDispatch e useSelector**

Utilizar a store criada dentro de um componente utilizando o `useSelector` para selecionar o estado e o `useDispatch` para despachar ações ao reducer.

```
// Contador.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { incrementar, reduzir } from './store/contador';

const Contador = () => {
  const dispatch = useDispatch();
  const contador = useSelector((state) => state.contador);

  return (
    <div>
      <button onClick={() => dispatch(incrementar())}>+</button>
      <button onClick={() => dispatch(reduzir())}>-</button>
      <p>{contador}</p>
    </div>
  );
};

export default Contador;
```

<br>

### **6 - Middleware (opcional)**

Criar um middleware para interferir em todas as ações que forem despachadas.

```
// store/middleware/logger.js
const logger = (store) => (next) => (action) => {
  const result = next(action);
  console.log(result);
  return result;
};

export default logger;
```

```
// store/configureStore.js
import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import contador from './contador';
import logger from './middleware/logger';

// Adicionar o middleware desestruturando o padrão que já existe
const middleware = [...getDefaultMiddleware(), logger];
const reducer = combineReducers({ contador });
const store = configureStore({ reducer, middleware });

export default store;
```

<br>

### **7 - Ações Assíncronas com Thunk**

```
// store/fotos.js
import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'fotos',
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

export default slice.reducer;

const { fetchStarted, fetchSuccess, fetchError } = slice.actions;

export const fetchFotos = (page) => async (dispatch) => {
  try {
    dispatch(fetchStarted());
    const response = await fetch(
      `https://dogsapi.origamid.dev/json/api/photo/?_page=${page}&_total=9&_user=0`,
      { cache: 'no-store' },
    );
    const data = await response.json();
    dispatch(fetchSuccess(data));
  } catch (error) {
    dispatch(fetchError(error.message));
  }
};
```

```
// store/configureStore.js
import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import contador from './contador';
import fotos from './fotos';
import logger from './middleware/logger';

const middleware = [...getDefaultMiddleware(), logger];
const reducer = combineReducers({ contador, fotos });
const store = configureStore({ reducer, middleware });

export default store;
```

```
// Fotos.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFotos } from './store/fotos';

const Fotos = () => {
  const dispatch = useDispatch();
  const { loading, error, data } = useSelector((state) => state.fotos);

  React.useEffect(() => {
    dispatch(fetchFotos(1));
  }, [dispatch]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;
  if (data)
    return (
      <ul>
        {data.map((foto) => (
          <li key={foto.id}>{foto.title}</li>
        ))}
      </ul>
    );
  else return null;
};

export default Fotos;
```

<br>

### **8 - Seletores**

Podemos definir seletores no arquivo do reducer para facilitar o uso de valores específicos da store

```
// Selectors
export const selectOverFiveYears = (state) =>
  state.fotos.data?.filter(({ idade }) => idade > 5);
```

```
// store/fotos.js
import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'fotos',
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

export default slice.reducer;

const { fetchStarted, fetchSuccess, fetchError } = slice.actions;

export const fetchFotos = (page) => async (dispatch) => {
  try {
    dispatch(fetchStarted());
    const response = await fetch(
      `https://dogsapi.origamid.dev/json/api/photo/?_page=${page}&_total=9&_user=0`,
      { cache: 'no-store' },
    );
    const data = await response.json();
    dispatch(fetchSuccess(data));
  } catch (error) {
    dispatch(fetchError(error.message));
  }
};

// Selectors
export const selectOverFiveYears = (state) =>
  state.fotos.data?.filter(({ idade }) => idade > 5);
```

```
// Fotos.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFotos, selectOverFiveYears } from './store/fotos';

const Fotos = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.fotos);
  const fotos = useSelector(selectOverFiveYears);

  React.useEffect(() => {
    dispatch(fetchFotos(1));
  }, [dispatch]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;
  if (fotos)
    return (
      <ul>
        {fotos.map((foto) => (
          <li key={foto.id}>{foto.title}</li>
        ))}
      </ul>
    );
  else return null;
};

export default Fotos;
```
