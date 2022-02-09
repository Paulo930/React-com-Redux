import React from 'react';
import { useSelector } from 'react-redux';
import './global.css';
import Header from './components/Header';
import Login from './pages/Login';
import Photos from './pages/Photos';

function App() {
  const user = useSelector((state) => state.login.user.data);
  return (
    <section className="container">
      <Header />
      {!user ? <Photos /> : <Login />}
    </section>
  );
}

export default App;
