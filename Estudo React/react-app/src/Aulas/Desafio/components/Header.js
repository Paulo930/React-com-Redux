import React from 'react';
import { useSelector } from 'react-redux';
import styles from './Header.module.css';

const Header = () => {
  const user = useSelector((state) => state.login.user.data);
  return (
    <div className={styles.header}>
      <h1 className={`${styles.title} ${!user && styles.active}`}>Mini Dogs</h1>
    </div>
  );
};

export default Header;
