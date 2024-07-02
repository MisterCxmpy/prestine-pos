import styles from './index.module.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className={styles['pagination']}>
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index + 1}
          onClick={() => onPageChange(index + 1)}
          className={currentPage === index + 1 ? styles['active'] : ''}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
