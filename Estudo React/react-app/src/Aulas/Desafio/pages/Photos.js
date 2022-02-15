import React from 'react';
import Photo from '../components/Photo';
import styles from './Photos.module.css';

const Photos = () => {
  return (
    <section className={`${styles.photos} animeLeft`}>
      <ul className={styles.listItems}>
        <Photo />
      </ul>
      <button className={styles.button}>+</button>
    </section>
  );
};

export default Photos;
