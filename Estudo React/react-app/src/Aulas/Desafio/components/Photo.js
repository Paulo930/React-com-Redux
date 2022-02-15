import React from 'react';
import styles from './Photo.module.css';

const Photo = () => {
  return (
    <li className={styles.item}>
      <div className={styles.image}></div>
      <div className={styles.info}>
        <h2 className={styles.title}>Joel</h2>
        <span className={styles.visualization}>11350</span>
      </div>
    </li>
  );
};

export default Photo;
