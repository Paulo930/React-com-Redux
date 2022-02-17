import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Error from '../helper/Error';
import Loading from '../helper/Loading';
import styles from './FeedModal.module.css';
import PhotoContent from '../Photo/PhotoContent';
import { closeModal } from '../../store/ui';

const FeedModal = () => {
  const { modal } = useSelector((state) => state.ui);
  const { data, loading, error } = useSelector((state) => state.photo);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(closeModal());
  }, [dispatch]);

  function handleOutsideClick({ target, currentTarget }) {
    if (target === currentTarget) dispatch(closeModal());
  }

  if (!modal) return null;
  return (
    <div className={styles.modal} onClick={handleOutsideClick}>
      {error && <Error error={error} />}
      {loading && <Loading />}
      {data && <PhotoContent data={data} />}
    </div>
  );
};

export default FeedModal;
