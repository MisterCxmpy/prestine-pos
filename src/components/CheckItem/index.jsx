import React, { useState } from 'react';
import styles from './index.module.css';
import { useCheckout } from '../../contexts/CheckoutContext';
import { useEffect } from 'react';

export default function CheckItem({ item }) {
  const [price, setPrice] = useState(item.price);
  const [quantity, setQuantity] = useState(1);
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

  const handleQuantityChange = (e) => {
    const inputQuantity = e.target.value;
    setQuantity(inputQuantity);

    setUpdatedItem({
      ...updatedItem,
      quantity: parseInt(inputQuantity),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addToCheckout({...updatedItem, price: parseFloat(price), quantity: parseInt(quantity)});
    closeCheck()
  };

  useEffect(() => {
    const handleKeyPressEvent = (event) => {
      if (event.key === 'Escape') {
        closeCheck();
      } else if (event.key === "Enter") {
        handleSubmit()
      }
    };
    window.addEventListener('keydown', handleKeyPressEvent);

    return () => {
      window.removeEventListener('keydown', handleKeyPressEvent);
    };
  }, []);

  return (
    <div className={styles['overlay']}>
      <div className={styles['outer']}>
        <button onClick={closeCheck} className={styles['close-btn']}>&times;</button>
        <form onSubmit={handleSubmit} className={styles['form']}>
          <div className={styles['form-input']}>
            <label htmlFor="name">Item name</label>
            <input type="text" id='name' readOnly value={item.name} />
          </div>
          <div className={`${styles['form-input']} ${styles["form-row"]}`}>
            <label htmlFor="price">Item price</label>
            <input
              type='text'
              id='price'
              value={price}
              onChange={handlePriceChange}
            />
            <label htmlFor="quantity">Quantity</label>
            <input
              type='text'
              id='quantity'
              value={quantity}
              onChange={handleQuantityChange}
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
