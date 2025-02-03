import React from 'react'
import styles from './index.module.css'
import { useItem } from '../../contexts/ItemContext';
import { useCheckout } from '../../contexts/CheckoutContext';
import useShortcut from '../../hooks/useShortcut';

export default function DeleteItemModal({ item }) {

  const { closeDeleteCheck } = useCheckout()

  const { deleteItem } = useItem();

  useShortcut([
    { keyCombo: { key: "Escape" }, action: () => {closeDeleteCheck()} },
    { keyCombo: { key: "Enter" }, action: () => {handleDelete()} },
  ]);

  const handleDelete = () => {
    deleteItem(item.id)
    closeDeleteCheck()
  }

  return (
    <div className={styles['overlay']}>
      <div className={styles['outer']}>
        <button onClick={closeDeleteCheck} className={styles['close-btn']}>&times;</button>
        <div className={styles['form']}>
          <p>{`Are you sure you want to delete ${item.name}`}</p>
          
          <div className={styles['form-buttons']}>
            <button onClick={closeDeleteCheck} type='button'>Cancel</button>
            <button onClick={() => handleDelete()}>Delete Item</button>
          </div>
        </div>
      </div>
    </div>
  )
}