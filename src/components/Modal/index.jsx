import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './index.module.css'; // Import your styles
import Overlay from '../Overlay';

const Modal = ({ children, openClose, setOpenClose }) => {

  return (
    <>
      {openClose && (
        <Overlay onClose={() => setOpenClose(false)}>
          <div className={styles['outer']} onClick={(e) => e.stopPropagation()}>
            <button type='button' onClick={() => setOpenClose(false)} className={styles['close-btn']}>
              &times;
            </button>
            {children}
          </div>
        </Overlay>
      )}
    </>
  );
};

Modal.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Modal;
