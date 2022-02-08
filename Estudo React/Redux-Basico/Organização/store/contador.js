const INCREMENTAR = 'contador/INCREMENTAR';
const REDUZIR = 'contador/REDUZIR';

export const incrementar = () => ({
  type: INCREMENTAR,
});

export const reduzir = () => ({
  type: REDUZIR,
});

const inicialState = 0;

const reducer = (state = inicialState, action) => {
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
