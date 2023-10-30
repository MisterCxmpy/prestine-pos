import React, { useState } from 'react'
import styles from './index.module.css'
import { useCheckout } from '../../contexts/CheckoutContext';
import { useEffect } from 'react';

export default function CustomerForm({ item }) {

  const [customerPhone, setCustomerPhone] = useState("");
  const [customerName, setCustomerName] = useState("");

  const { openCloseReceipt, openCloseCustomerForm, setCustomerDetails } = useCheckout()
  
  const handleCustomerName = (e) => {
    const inputName = e.target.value;
    setCustomerName(inputName);
  };

  const handleCustomerPhone = (e) => {
    const inputPhone = e.target.value;
    setCustomerPhone(inputPhone);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setCustomerDetails({ownerName: customerName, ownerMob: customerPhone})

    openCloseCustomerForm(false)
    openCloseReceipt(true)
  };

  const closeCheck = () => {
    openCloseCustomerForm(false)
    openCloseReceipt(true)
  }

  useEffect(() => {
    const handleKeyPressEvent = (event) => {
      if (event.key === 'Escape') {
        closeCheck();
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
            <label htmlFor="name">Customer Name</label>
            <input type="text" id='name' value={customerName} onChange={handleCustomerName} autoComplete='off' />
          </div>
          <div className={styles['form-input']}>
            <label htmlFor="phone">Customer Phone NO</label>
            <input
              type='text'
              id='phone'
              value={customerPhone}
              onChange={handleCustomerPhone}
              autoComplete='off'
            />
          </div>
          <div className={styles['form-buttons']}>
            <button onClick={closeCheck} type='button'>Cancel</button>
            <button type='submit'>Confirm</button>
          </div>
        </form>
      </div>
    </div>
  )
}