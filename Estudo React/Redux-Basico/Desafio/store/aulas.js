const COMPLETAR_AULA = 'aulas/COMPLETAR_AULA';
const COMPLETAR_CURSO = 'aulas/COMPLETAR_CURSO';
const RESETAR_CURSO = 'aulas/RESETAR_CURSO';

export const completarAula = (id) => ({ type: COMPLETAR_AULA, payload: id });
export const completarCurso = () => ({ type: COMPLETAR_CURSO });
export const resetarCurso = () => ({ type: RESETAR_CURSO });

const inicialState = [
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

const reduce = (state = inicialState, action) => {
  switch (action.type) {
    case COMPLETAR_AULA:
      return state.map((item) =>
        item.id === action.payload ? { ...item, completa: true } : item,
      );
    case COMPLETAR_CURSO:
      return state.map((item) => ({ ...item, completa: true }));
    case RESETAR_CURSO:
      return state.map((item) => ({ ...item, completa: false }));
    default:
      return state;
  }
};

export default reduce;
