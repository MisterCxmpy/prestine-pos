import React, { useState, useEffect } from 'react';
import styles from './index.module.css';
import { useCheckout } from '../../contexts/CheckoutContext';
import SearchCustomer from '../SearchCustomer';

export default function CustomerForm({ item }) {
  const [openClose, setOpenClose] = useState(false);

  const { openCloseReceipt, openCloseCustomerForm, setCustomerDetails, setCustomerName, setCustomerPhone, customerName, customerPhone } = useCheckout();

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

    setCustomerDetails({ ownerName: customerName, ownerMob: customerPhone });

    openCloseCustomerForm(false);
    openCloseReceipt(true);
  };

  const closeCheck = () => {
    openCloseCustomerForm(false);
    openCloseReceipt(true);
  };
  
  const handleSelectCustomer = (selectedCustomer) => {
    setCustomerName(selectedCustomer.ownerName);
    setCustomerPhone(selectedCustomer.ownerMob);
    setOpenClose(false);
  };

  useEffect(() => {
    const handleKeyPressEvent = (event) => {
      if (event.key === 'Escape') {
        closeCheck();
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
        <button onClick={closeCheck} className={styles['close-btn']}>&times;</button>
        <form onSubmit={handleSubmit} className={styles['form']}>
          <div className={styles['form-input']}>
            <label htmlFor="name">Customer Name</label>
            <input type="text" id="name" value={customerName} onChange={handleCustomerName} autoComplete="off" />
          </div>
          <div className={styles['form-input']}>
            <label htmlFor="phone">Customer Phone NO</label>
            <input
              type="text"
              id="phone"
              value={customerPhone}
              onChange={handleCustomerPhone}
              autoComplete="off"
            />
          </div>
          <div className={styles['form-buttons']}>
            <button onClick={closeCheck} type="button">Cancel</button>
            <button type="submit">Confirm</button>
          </div>
        </form>
        <button onClick={() => setOpenClose(true)}>Search Customer</button>
      </div>
      <SearchCustomer onSelectCustomer={handleSelectCustomer} openClose={openClose} setOpenClose={setOpenClose} />
    </div>
  );
}
