import React from 'react';
import styles from './Photos.module.css';

const Photos = () => {
  return (
    <section className={`${styles.photos} animeLeft`}>
      <ul className={styles.listItems}>
        <li className={styles.item}>
          <div className={styles.image}></div>
          <div className={styles.info}>
            <h2 className={styles.title}>Joel</h2>
            <span className={styles.visualization}>11350</span>
          </div>
        </li>
        <li className={styles.item}>
          <div className={styles.image}></div>
          <div className={styles.info}>
            <h2 className={styles.title}>Elie</h2>
            <span className={styles.visualization}>36105</span>
          </div>
        </li>
        <li className={styles.item}>
          <div className={styles.image}></div>
          <div className={styles.info}>
            <h2 className={styles.title}>Abby</h2>
            <span className={styles.visualization}>11350</span>
          </div>
        </li>
      </ul>
      <button className={styles.button}>+</button>
    </section>
  );
};

export default Photos;
