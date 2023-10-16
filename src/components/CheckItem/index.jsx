import React, { useState } from 'react';
import styles from './index.module.css';
import { useCheckout } from '../../contexts/CheckoutContext';

export default function CheckItem({ item }) {
  const [price, setPrice] = useState(item.price);
  const [updatedItem, setUpdatedItem] = useState(item);

  const { addToCheckout, closeCheck } = useCheckout()
  
  const handlePriceChange = (e) => {
    const inputPrice = e.target.value;
    setPrice(inputPrice);

    setUpdatedItem({
      ...updatedItem,
      price: parseFloat(inputPrice),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addToCheckout(updatedItem);
    closeCheck()
  };

  return (
    <div className={styles['overlay']}>
      <div className={styles['outer']}>
        <button onClick={closeCheck} className={styles['close-btn']}>&times;</button>
        <form onSubmit={handleSubmit} className={styles['form']}>
          <div className={styles['form-input']}>
            <label htmlFor="name">Item name</label>
            <input type="text" id='name' readOnly value={item.name} />
          </div>
          <div className={styles['form-input']}>
            <label htmlFor="price">Item price</label>
            <input
              type='text'
              id='price'
              value={price}
              onChange={handlePriceChange}
            />
          </div>
          <div className={styles['form-buttons']}>
            <button onClick={closeCheck} type='button'>Cancel</button>
            <button type='submit'>Add Item</button>
          </div>
        </form>
      </div>
    </div>
  );
}
