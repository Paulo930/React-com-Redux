import React from 'react';
import { useDispatch } from 'react-redux';
import { adicionarDatas } from './store/date';

const App = () => {
  const [nome, setNome] = React.useState('');
  const [partida, setPartida] = React.useState('');
  const [retorno, setRetorno] = React.useState('');
  const dispatch = useDispatch();

  function handleSubmit(event) {
    event.preventDefault();
    dispatch(adicionarDatas({ partida, retorno, nome }));
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>
        <label htmlFor="nome">Nome</label>
        <input
          type="text"
          id="nome"
          value={nome}
          onChange={({ target: { value } }) => setNome(value)}
        />
      </p>
      <p>
        <label htmlFor="partida">Partida</label>
        <input
          type="date"
          id="partida"
          value={partida}
          onChange={({ target: { value } }) => setPartida(value)}
        />
      </p>
      <p>
        <label htmlFor="retorno">Retorno</label>
        <input
          type="date"
          id="retorno"
          value={retorno}
          onChange={({ target: { value } }) => setRetorno(value)}
        />
      </p>
      <button>Buscar</button>
    </form>
  );
};

export default App;
