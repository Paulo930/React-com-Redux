import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../components/Loading';
import { autoLogin, login } from '../store/login';
import styles from './Login.module.css';

const Login = () => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.login.token);

  React.useEffect(() => {
    dispatch(autoLogin());
  }, [dispatch]);

  function handleSubmit(event) {
    event.preventDefault();
    dispatch(
      login({
        username,
        password,
      }),
    );
  }

  if (loading) return <Loading />;
  if (error) return <p>{error}</p>;
  return (
    <form className="animeLeft" onSubmit={handleSubmit}>
      <label className={styles.label} htmlFor="username">
        Usuário
      </label>
      <input
        id="username"
        type="text"
        className={styles.input}
        value={username}
        onChange={({ target: { value } }) => setUsername(value)}
      />
      <label className={styles.label} htmlFor="password">
        Senha
      </label>
      <input
        id="password"
        type="password"
        className={styles.input}
        value={password}
        onChange={({ target: { value } }) => setPassword(value)}
      />
      <button className={styles.button}>Enviar</button>
    </form>
  );
};

export default Login;
