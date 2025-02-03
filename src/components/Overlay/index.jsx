import React from 'react'
import styles from './index.module.css'

export default function Overlay({ children, onClose, direction = "column" }) {

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose(false);
    }
  };

  
  return (
    <div onMouseDown={(e) => handleOverlayClick(e)} className={`${styles['overlay']} ${direction === "row" ? styles["row"] : styles["column"]}`}>
      {children}
    </div>
  )
}