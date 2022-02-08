# REDUX BÁSICO

## Store

<br>

### **Adicionar o Redux**

Podemos instalar via NPM, caso estejamos usando com webpack/similar, ou diretamenta via link do script.

```
npm install redux
```

Ou baixe o arquivo direto

https://redux.js.org/introduction/installation

```
<script src="./redux.min.js"></script>
```

<br>

### **Store**

Primeiro iniciamos a nossa `store` com `Redux.createStore()`. A store dá acesso ao estado global e permite despacharmos ações que modificam o mesmo.

É essencial passarmos uma função como primeiro argumento do `createStore`, essa função é chamada de `reducer`. O `reducer` é a função responsável por retornar o estado atual da store.

```
function reducer() {
  return {
    nome: 'André',
    id: 199,
  };
}

const store = Redux.createStore(reducer);
```

<br>

### **getState**

O método `getState()` retorna o estado atual da `store`.

```
function reducer() {
  return {
    nome: 'André',
    id: 199,
  };
}

const store = Redux.createStore(reducer);
const state = store.getState();
console.log(state.nome); // André
```

<br>

### **Reducer**

A função de reducer recebe dois argumentos principais, o primeiro sendo o estado atual `state` e o segundo uma ação `action` que será utilizado para identificarmos as ações despachadas pela store.

```
function reducer(state = 10, action) {
  return state;
}

const store = Redux.createStore(reducer);
const state = store.getState();
console.log(state); // 10
```

```
// O estado inicial também pode ser passado direto no createStore
const store = Redux.createStore(reducer, 10);
```

## Action

<br>

### **Action**

Para atualizarmos o estado, enviamos uma ação `action` através da `store` utilizando o método `dispatch`. Uma ação é sempre um objeto que contem o tipo `type` e um valor caso necessário `payload`.

No `reducer` verificamos o tipo de ação enviada e retornamos o novo estado a partir disso.

```
function reducer(state = 10, action) {
  if (action.type === 'somar') {
    return state + action.payload;
  } else {
    return state;
  }
}
const store = Redux.createStore(reducer);

let state = store.getState();
console.log(state); // 10

// Envia um objeto com type e payload para o reducer
store.dispatch({ type: 'somar', payload: 25 });

state = store.getState();
console.log(state); // 35
```

<br>

### **Sem Payload**

Não é necessário passar sempre um payload. Existem ações que só precisam do tipo para serem efetivas.

```
function reducer(state = 0, action) {
  if (action.type === 'incrementar') {
    return state + 1;
  }
  if (action.type === 'reduzir') {
    return state - 1;
  }
  return state;
}
const store = Redux.createStore(reducer);

store.dispatch({ type: 'incrementar' });
store.dispatch({ type: 'incrementar' });
store.dispatch({ type: 'incrementar' });
store.dispatch({ type: 'reduzir' });

state = store.getState();
console.log(state); // 2
```

<br>

### **Constantes**

O tipo `type` da ação é sempre uma string que identifica a mesma. Por ser uma string, o utilizador das mesmas pode acabar cometendo um erro de digitação, introduzindo assim um BUG ao aplicativo.

Para evitar esse problema é comum criarmos constantes para os nomes de cada ação que possuirmos.

```
const INCREMENTAR = 'INCREMENTAR';
const REDUZIR = 'REDUZIR';
const SOMAR = 'SOMAR';

function reducer(state = 0, action) {
  if (action.type === INCREMENTAR) {
    return state + 1;
  }
  if (action.type === REDUZIR) {
    return state - 1;
  }
  if (action.type === SOMAR) {
    return state + action.payload;
  }
  return state;
}
const store = Redux.createStore(reducer);

store.dispatch({ type: INCREMENTAR });
store.dispatch({ type: REDUZIR });
store.dispatch({ type: SOMAR, payload: 20 });
```

<br>

### **Action Creator**

Mais uma prática comum para facilitar o uso de ações é a criação de funções que retornam o objeto da ação. Essas são chamadas de Action Creators.

```
function incrementar() {
  return { type: INCREMENTAR };
}

function reduzir() {
  return { type: REDUZIR };
}

function somar(payload) {
  return { type: SOMAR, payload };
}

store.dispatch(incrementar());
store.dispatch(reduzir());
store.dispatch(somar(20));
```

<br>

### **Eventos**

As ações geralmente serão disparadas através de eventos. Seja com o addEventListener no `JavaScript` ou em eventos como `onClick` no React.

```
const button = document.querySelector('.button');
button.addEventListener('click', () => store.dispatch(incrementar()));
```

## Subscribe

<br>

### **Atualização do estado**

Quando o estado é modificado através de uma ação é necessário renderizarmos o mesmo novamente na tela.

```
<h1>Total: <span id="total"></span></h1>
<script>
  function reducer(state = 0, action) {
    if (action.type === 'incrementar') {
      return state + 1;
    }
    if (action.type === 'reduzir') {
      return state - 1;
    }
    return state;
  }
  const store = Redux.createStore(reducer);

  const total = document.getElementById('total');
  total.innerText = store.getState(); // 0

  store.dispatch({ type: 'incrementar' });

  // Se não renderizarmos novamente o resultado, ele irá se manter 0 na tela
  total.innerText = store.getState(); // 1
</script>
```

<br>

### **Subscribe**

A store possui o método `subscribe` que irá ativar a função que for passada como argumento do mesmo, todas as vezes que uma ação for despachada via `dispatch`.

```
<h1>Total: <span id="total"></span></h1>
<script>
  function reducer(state = 0, action) {
    if (action.type === 'incrementar') {
      return state + 1;
    }
    if (action.type === 'reduzir') {
      return state - 1;
    }
    return state;
  }
  const store = Redux.createStore(reducer);

  function render() {
    const total = document.getElementById('total');
    total.innerText = store.getState();
  }
  // Ativa a função render sempre que o dispatch ocorrer
  store.subscribe(render);

  store.dispatch({ type: 'incrementar' });
  store.dispatch({ type: 'incrementar' });
  store.dispatch({ type: 'incrementar' });
  store.dispatch({ type: 'incrementar' });
  store.dispatch({ type: 'reduzir' });
</script>
```

É válido o uso de múltiplos subscribes.

```
store.subscribe(render);
store.subscribe(() => {
  console.log('Atualizado');
});
```

<br>

### **Unsubscribe**

Se por algum motivo desejar que a função pare de ser ativada quando ocorrer um dispatch, é possível utilizar o `unsubscribe` que é o retorno da ativação do método subscribe.

```
const unsubscribe = store.subscribe(render);
store.dispatch({ type: 'incrementar' });

unsubscribe();
// não vai mais ativar o render
store.dispatch({ type: 'incrementar' });
```

## Reducer

<br>

### **Switch**

É comum o uso do `switch statement` dentro do reducer ao invés do uso de `if/else`. Serve apenas para facilitar a leitura e evitar a repetição do action.type.

```
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
const store = Redux.createStore(reducer);
```

<br>

### **combineReducers**

Podemos dividir o código do reducer em diferentes funções e combiná-las ao final. Vale lembrar que ao final o reducer sempre será único e toda ação despachada irá passar por todos os reducers.

```
function contador(state = 0, action) {
  switch (action.type) {
    case 'INCREMENTAR':
      return state + 1;
    case 'REDUZIR':
      return state - 1;
    default:
      return state;
  }
}
function modal(state = false, action) {
  switch (action.type) {
    case 'ABRIR':
      return true;
    case 'FECHAR':
      return false;
    default:
      return state;
  }
}
const reducer = Redux.combineReducers({ contador, modal });
const store = Redux.createStore(reducer);

const state = store.getState();
console.log(state); // { contador: 0, modal: false }
```

## Função Pura

<br>

### **Regra 01 - Função Pura**

Funções puras retornam sempre o mesmo valor dado um mesmo argumento e não produzem efeitos colaterais.

Retornar um mesmo valor significa que os cálculos internos da função não podem depender de números aleatórios, tempo, data e outros dados que possam mudar no futuro.

Efeitos colaterais são aqueles que impactam objetos/elementos que não pertencem a função. Exemplo: fetch, setTimeout, manipular dom, modificar objetos/arrays externas e outros.

```
<!-- Incorreta -->
<div id="caixa" style="background: blue; height: 50px"></div>
<script>
  function reducer(state = 0, action) {
    switch (action.type) {
      case 'MODIFICAR_WIDTH':
        // Efeito colateral, está manipulando o DOM.
        const caixa = document.getElementById('caixa');
        caixa.style.width = action.payload + 'px';
        return action.payload;
      default:
        return state;
    }
  }
  const store = Redux.createStore(reducer);
  store.dispatch({ type: 'MODIFICAR_WIDTH', payload: 100 });
</script>
```

```
<!-- Correta -->
<div id="caixa" style="background: blue; height: 50px"></div>
<script>
  function reducer(state = 0, action) {
    switch (action.type) {
      case 'MODIFICAR_WIDTH':
        // O reducer atualiza apenas o estado
        return action.payload;
      default:
        return state;
    }
  }
  const store = Redux.createStore(reducer);
  function render() {
    // O dom é manipulado pela função de renderização.
    // No caso do React seria dentro do componente.
    const caixa = document.getElementById('caixa');
    const state = store.getState();
    caixa.style.width = store.getState() + 'px';
  }
  store.subscribe(render);
  store.dispatch({ type: 'MODIFICAR_WIDTH', payload: 100 });
</script>
```

<br>

### **Redux DevTools**

Uma das principais vantagens do uso do Redux é a utilização da sua extensão do browser para debugarmos mudanças no estado.

Instalar no Chrome

https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=pt

Configurar na store

https://github.com/zalmoxisus/redux-devtools-extension

```
const store = Redux.createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
```

<br>

### **Efeitos colaterais**

Um dos problemas dos efeitos colaterais é o fato deles quebrarem funcionalidades da devtool como o Time Travel.

```
// Incorreto
function reducer(state = 0, action) {
  switch (action.type) {
    case 'MODIFICAR_WIDTH':
      const caixa = document.getElementById('caixa');
      caixa.style.width = action.payload + 'px';
      return action.payload;
    default:
      return state;
  }
}
const store = Redux.createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
store.dispatch({ type: 'MODIFICAR_WIDTH', payload: 100 });
store.dispatch({ type: 'MODIFICAR_WIDTH', payload: 200 });
store.dispatch({ type: 'MODIFICAR_WIDTH', payload: 300 });
```

```
// Correto
function reducer(state = 0, action) {
  switch (action.type) {
    case 'MODIFICAR_WIDTH':
      return action.payload;
    default:
      return state;
  }
}
const store = Redux.createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
function render() {
  const caixa = document.getElementById('caixa');
  caixa.style.width = store.getState() + 'px';
}
store.subscribe(render);
store.dispatch({ type: 'MODIFICAR_WIDTH', payload: 100 });
store.dispatch({ type: 'MODIFICAR_WIDTH', payload: 200 });
store.dispatch({ type: 'MODIFICAR_WIDTH', payload: 300 });
```

## Imutabilidade

<br>

### **Regra 02 - Imutabilidade**

A função reducer deve sempre retornar um estado novo, quando este for modificado. Nunca modifique o estado diretamente (ele deve ser imutável). O conceito de mutabilidade interfere principalmente em como lidamos com objetos e arrays.

```
const initialState = {
  nome: 'André',
  idade: 31,
};
```

```
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'MUDAR_NOME':
      // retorna um objeto novo
      return { ...state, nome: action.payload };
    default:
      return state;
  }
};
```

```
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'MUDAR_NOME':
      // muta o estado, errado
      state.nome = action.payload;
      return state;
    default:
      return state;
  }
};
```

<br>

### **Arrays**

Utlize o spread `[...array]` para criar uma "cópia".

```
const array1 = [0, 1, 2, 3];
const array2 = array1; // cria uma referência
const array3 = [...array1]; // cria uma "cópia" da array original

console.log(array1 === array2); // true
console.log(array1 === array3); // false
```

```
// Métodos que mutam uma array
const array = [0, 1, 2, 4, 5];
array.copyWithin();
array.fill();
array.pop();
array.push();
array.reverse();
array.shift();
array.sort();
array.splice();
array.unshift();
```

```
// Alguns métodos que geram uma array nova:
const array = [0, 1, 2, 4, 5];
array.concat();
array.filter();
array.map();
array.reduce();
array.flat();
array.join();
```

> A cópia não é perfeita.

<br>

### **Objetos**

O spread também pode ser utilizado para criarmos uma "cópia" de um objeto.

```
const obj1 = { nome: 'André', idade: 31 };
const obj2 = obj1;
const obj3 = { ...obj1 };
const obj4 = Object.assign({}, obj1); // cria um novo objeto

console.log(obj1 === obj2); // true
console.log(obj1 === obj3); // false
console.log(obj1 === obj4); // false
```

```
const obj1 = { nome: 'André', idade: 31 };

// Adicionar/modificar propriedades, muta o objeto
obj1.profissao = 'Designer'; // mutou o objeto
obj1.nome = 'Rafael'; // mutou o objeto
```

```
const obj1 = { nome: 'André', idade: 31 };

// Cria um objeto novo e modifica o valor de idade.
const obj2 = { ...obj1, idade: 35 };
const obj3 = Object.assign({}, obj1, { idade: 35 });
```

<br>

### **Immer**

O immer é um pacote que nos fornece uma função, na qual podemos utilizar todos os métodos que mutam arrays ou objetos, sem se preocupar com a questão de imutabilidade. Pois a função do immer será sempre produzir um objeto/array novos.

O mesmo faz parte do pacote `Redux Toolkit`, que é um pacote com diversas ferramentas que irão facilitar escrevermos o código do Redux.

```
// Com o Immer
const obj1 = { nome: 'André', idade: 31 };

// cria um objeto novo e modifica o valor de idade.
const obj2 = immer.produce(obj1, (draft) => {
  draft.idade = 35;
});

console.log(obj1 === obj2); // false
```

```
// Com o Immer
const obj1 = { nome: 'André', idade: 31 };

// cria um objeto novo e modifica o valor de idade.
const obj2 = immer.produce(obj1, (draft) => {
  draft.idade = 35;
});

console.log(obj1 === obj2); // false
```

```
// Mesmo uma função que recebe um objeto, continua fazendo referência ao mesmo
function mudarIdade(obj, idade) {
  obj.idade = idade;
  return obj;
}
const obj3 = mudarIdade(obj1, 50);

console.log(obj1 === obj3);
```

<br>

### **Immer e Reducer**

Podemos envolver a função completa do reducer dentro do `produce` do Immer.

```
const initialState = {
  nome: 'André',
  sobre: {
    dados: {
      idade: 31,
    },
  },
};
```

```
// Não é necessário o default ou return
// O break trava o switch statement
const reducer = immer.produce((state, action) => {
  switch (action.type) {
    case 'MUDAR_NOME':
      state.nome = action.payload;
      break;
    case 'MUDAR_IDADE':
      state.sobre.dados.idade = action.payload;
      break;
  }
}, initialState);
```

```
// Sem o Immer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'MUDAR_NOME':
      return { ...state, nome: action.payload };
    case 'MUDAR_IDADE':
      return {
        ...state,
        sobre: {
          ...state.sobre,
          dados: {
            ...state.sobre.dados,
            idade: action.payload,
          },
        },
      };
    default:
      return state;
  }
};
```

## Organização

<br>

### **Organização**

Existem diferentes formas de organizarmos os arquivos do Redux. No curso vamos utilizar uma inspirada no padrão `ducks`, onde vamos manter as ações e o reducer relacionado em um mesmo arquivo.

https://github.com/erikras/ducks-modular-redux

```
// contador.js
// Constant
const INCREMENTAR = 'contador/INCREMENTAR';
const REDUZIR = 'contador/REDUZIR';

// Action Creator
export const incrementar = () => ({ type: INCREMENTAR });
export const reduzir = () => ({ type: REDUZIR });

// Initial State
const initialState = 0;

// Reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case INCREMENTAR:
      return state + 1;
    case REDUZIR:
      return state - 1;
    default:
      return state;
  }
};

export default reducer;
```

```
// configureStore.js
import contador from './contador.js';

const reducer = Redux.combineReducers({ contador });

const store = Redux.createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

export default store;
```

```
<!-- index.html -->
<h1 id="total"></h1>

<script type="module">
  import { incrementar, reduzir } from './contador.js';
  import store from './configureStore.js';

  function render() {
    const { contador } = store.getState();
    const total = document.getElementById('total');
    total.innerText = contador;
  }
  render();
  store.subscribe(render);

  store.dispatch(incrementar());
  store.dispatch(incrementar());
  store.dispatch(incrementar());
  store.dispatch(reduzir());
</script>
```

## Desafio

<br>

### **Desafio**

```
// Usando o Redux (pode usar Immer ou Não).
// Crie uma store contendo os estados iniciais abaixo
// Crie as seguintes ações:
// aluno/INCREMENTAR_TEMPO, adiciona 1 dia de acesso
// aluno/REDUZIR_TEMPO, reduz 1 dia de acesso
// aluno/MODIFICAR_EMAIL(email), modifica o email do usuário
// aulas/COMPLETAR_AULA(id), completa a aula com base no ID passado
// aulas/COMPLETAR_CURSO, completa todas as aulas
// aulas/RESETAR_CURSO, reseta todas as aulas completas
// Crie constantes e action creators para as ações.
// Crie um reducer para aluno e um para aulas.
// Renderize na tela o nome, email, tempo restante e o total de aulas completas
// Configure a DevTools

const aluno = {
  nome: 'André Rafael',
  email: 'andre@origamid.com',
  diasRestantes: 120,
};

const aulas = [
  {
    id: 1,
    nome: 'Design',
    completa: true,
  },
  {
    id: 2,
    nome: 'HTML',
    completa: false,
  },
  {
    id: 3,
    nome: 'CSS',
    completa: false,
  },
  {
    id: 4,
    nome: 'JavaScript',
    completa: false,
  },
];
```

<br>

### **Solução**

Você pode dividir cada reducer em um arquivo separado, para facilitar a organização.

```
// aluno.js
const INCREMENTAR_TEMPO = 'aluno/INCREMENTAR_TEMPO';
const REDUZIR_TEMPO = 'aluno/REDUZIR_TEMPO';
const MODIFICAR_EMAIL = 'aluno/MODIFICAR_EMAIL';

export const incrementarTempo = () => ({ type: INCREMENTAR_TEMPO });
export const reduzirTempo = () => ({ type: REDUZIR_TEMPO });
export const modificarEmail = (payload) => ({ type: MODIFICAR_EMAIL, payload });

const initialState = {
  nome: 'André Rafael',
  email: 'andre@origamid.com',
  diasRestantes: 120,
};

const reducer = immer.produce((state, action) => {
  switch (action.type) {
    case INCREMENTAR_TEMPO:
      state.diasRestantes++;
      break;
    case REDUZIR_TEMPO:
      state.diasRestantes--;
      break;
    case MODIFICAR_EMAIL:
      state.email = action.payload;
      break;
  }
}, initialState);

export default reducer;
```

```
// aulas.js
const COMPLETAR_AULA = 'aulas/COMPLETAR_AULA';
const COMPLETAR_CURSO = 'aulas/COMPLETAR_CURSO';
const RESETAR_CURSO = 'aulas/RESETAR_CURSO';

export const completarAula = (payload) => ({ type: COMPLETAR_AULA, payload });
export const completarCurso = () => ({ type: COMPLETAR_CURSO });
export const resetarCurso = () => ({ type: RESETAR_CURSO });

const initialState = [
  {
    id: 1,
    nome: 'UX/UI Design',
    completa: true,
  },
  {
    id: 2,
    nome: 'HTML',
    completa: false,
  },
  {
    id: 3,
    nome: 'CSS',
    completa: false,
  },
  {
    id: 4,
    nome: 'JavaScript',
    completa: false,
  },
];

const reducer = immer.produce((state, action) => {
  switch (action.type) {
    case COMPLETAR_AULA:
      const index = state.findIndex((x) => x.id === action.payload);
      if (!isNaN(index) && state[index]) state[index].completa = true;
      break;
    case COMPLETAR_CURSO:
      state.forEach((aula) => (aula.completa = true));
      break;
    case RESETAR_CURSO:
      state.forEach((aula) => (aula.completa = false));
      break;
  }
}, initialState);

export default reducer;
```

```
// configureStore.js
import aluno from './aluno.js';
import aulas from './aulas.js';

const reducer = Redux.combineReducers({ aluno, aulas });

const store = Redux.createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

export default store;
```

```
<!-- index.html -->
<h1 id="aluno"></h1>
<h1 id="aulas"></h1>

<script type="module">
  import { incrementarTempo, reduzirTempo, modificarEmail } from './aluno.js';
  import { completarAula, completarCurso, resetarCurso } from './aulas.js';

  import store from './configureStore.js';

  function render() {
    const { aulas, aluno } = store.getState();
    const aulasEl = document.getElementById('aulas');
    const alunoEl = document.getElementById('aluno');
    aulasEl.innerText = aulas.filter((a) => a.completa === true).length;
    alunoEl.innerText = `${aluno.nome} : ${aluno.email} : ${aluno.diasRestantes}`;
  }
  render();
  store.subscribe(render);

  store.dispatch(resetarCurso());
  store.dispatch(completarAula(3));
  store.dispatch(completarCurso());
  store.dispatch(reduzirTempo());
  store.dispatch(incrementarTempo());
  store.dispatch(incrementarTempo());
  store.dispatch(modificarEmail('joao@origamid.com'));
</script>
```
