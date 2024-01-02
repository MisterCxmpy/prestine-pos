import React, { useState, useEffect } from 'react';
import styles from './index.module.css';
import { useCheckout } from '../../contexts/CheckoutContext';

export default function Discount({ item }) {
  const {
    total,
    openCloseDiscountForm,
    setDiscountValue,
    setDiscountType,
    discountValue,
    discountType,
    updateDiscountTotal
  } = useCheckout();

  useEffect(() => {
    setDiscountValue(0);
    setDiscountType("%");
  }, [])

  const handleDiscountTypeChange = (e, type) => {
    e.preventDefault()
    setDiscountType(type);
  };

  const handleDiscountValueChange = (e) => {
    e.preventDefault()
    setDiscountValue(e.target.value);
  };

  const calculateDiscountedPrice = () => {
    let discountedPrice = total;

    if (discountType === '%') {
      const discountPercentage = parseFloat(discountValue);
      discountedPrice = total - (total * (discountPercentage / 100));
    } else if (discountType === '£') {
      const discountAmount = parseFloat(discountValue);
      discountedPrice = total - discountAmount;
    }

    return discountedPrice;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const calculatedDiscountedPrice = calculateDiscountedPrice();
    updateDiscountTotal(calculatedDiscountedPrice)
    openCloseDiscountForm(false);
  };

  useEffect(() => {
    const handleKeyPressEvent = (event) => {
      if (event.key === 'Escape') {
        openCloseDiscountForm(false);
      } else if (event.key === 'Enter') {
        handleSubmit();
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
        <button onClick={() => openCloseDiscountForm(false)} className={styles['close-btn']}>
          &times;
        </button>
        <form onSubmit={handleSubmit} className={styles['form']}>
          <div className={styles['form-input']}>
            <label htmlFor="name">Total Price</label>
            <input type="text" id="name" readOnly value={`£${total.toFixed(2)}`} />
          </div>
          <div className={styles['form-input']}>
            <label htmlFor="discountedPrice">Discounted Price</label>
            <input type="text" id="discountedPrice" readOnly value={`£${calculateDiscountedPrice().toFixed(2)}`} />
          </div>
          <div className={`${styles['form-input']} ${styles['form-row']}`}>
            <label>Discount Type</label>
            <div className={styles['discount-type-buttons']}>
              <button
                className={`${styles['discount-type-button']} ${discountType === '%' ? styles['active'] : ''}`}
                onClick={(e) => handleDiscountTypeChange(e, '%')}
              >
                %
              </button>
              <button
                className={`${styles['discount-type-button']} ${discountType === '£' ? styles['active'] : ''}`}
                onClick={(e) => handleDiscountTypeChange(e, '£')}
              >
                £
              </button>
            </div>
          </div>
          <div className={`${styles['form-input']} ${styles['form-row']}`}>
            <label htmlFor="discountValue">Discount value</label>
            <input
              type="text"
              id="discountValue"
              value={discountValue}
              onChange={(e) => handleDiscountValueChange(e)}
            />
          </div>
          <div className={styles['form-buttons']}>
            <button onClick={() => openCloseDiscountForm(false)} type="button">
              Cancel
            </button>
            <button type="submit">Apply Discount</button>
          </div>
        </form>
      </div>
    </div>
  );
}
