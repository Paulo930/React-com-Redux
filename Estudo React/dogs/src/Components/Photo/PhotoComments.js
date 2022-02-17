import React from 'react';
import PhotoCommentsForm from './PhotoCommentsForm';
import styles from './PhotoComments.module.css';
import { useSelector } from 'react-redux';

const PhotoComments = ({ id, comments: propsComments, single }) => {
  const [comments, setComments] = React.useState(() => propsComments);
  const commentsSection = React.useRef(null);
  const { data } = useSelector((state) => state.user);
  React.useEffect(() => {
    commentsSection.current.scrollTop = commentsSection.current.scrollHeight;
  }, [comments]);

  return (
    <>
      <ul
        ref={commentsSection}
        className={`${styles.comments} ${single ? styles.single : ''}`}
      >
        {comments.map((comment) => (
          <li key={comment.comment_ID}>
            <b>{comment.comment_author}: </b>
            <span>{comment.comment_content}</span>
          </li>
        ))}
      </ul>
      {data && (
        <PhotoCommentsForm single={single} id={id} setComments={setComments} />
      )}
    </>
  );
};

export default PhotoComments;
