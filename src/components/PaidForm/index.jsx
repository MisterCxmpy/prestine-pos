import React, { useEffect, useState } from 'react'
import styles from './index.module.css'
import { useCheckout } from '../../contexts/CheckoutContext';

export default function PaidForm({ setPreview, price}) {

  const { toggleHasPaid } = useCheckout()

  const [changeAmount, setChangeAmount] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [totalCost, setTotalCost] = useState(price);

  const handleClose = () => {
    setPreview(false);
    setChangeAmount(0)
    setInputValue("")
    setTotalCost(price)
    handleClose()
  };

  const handleKeyPress = (key) => {
    if (key === 'Back') {
      setInputValue(inputValue.slice(0, -1));
    } else {
      setInputValue(inputValue + key);
    }
  };

  const handleContinue = () => {
    const entered = parseFloat(inputValue);
    const newTotalCost = totalCost - entered;
    setTotalCost(newTotalCost < 0 ? 0 : newTotalCost);
    setInputValue("")
  };

  const handleFinish = () => {
    toggleHasPaid()
    setChangeAmount(0)
    setInputValue("")
    setTotalCost(price)
    handleClose()
  }

  useEffect(() => {
    const entered = parseFloat(inputValue);
    const newChangeAmount = totalCost - entered;
    setChangeAmount(newChangeAmount < 0 ? newChangeAmount : 0);
  }, [inputValue, totalCost]);

  useEffect(() => {
    const handleKeyPressEvent = (event) => {
      if (event.key === 'Escape') {
        handleClose();
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
        <button onClick={() => handleClose()} className={styles['close-btn']}>&times;</button>
        <div className={styles['form']}>
          <div className={styles['payment-amount']}>
            <p>Balance due: £{totalCost.toFixed(2)}</p>
          </div>
          <div className={styles['payment-form']}>
            <ul className={styles['quick-payments']}>
              {["50.00", "20.00", "10.00", "5.00"].map((p, i) => {
                return (
                  <li key={i} className={styles['quick-payment-option']}>
                    <div onClick={() => handleKeyPress(parseFloat(p))} className={styles['quick-payment']}>
                      <p>£{p}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
            <div className={styles['calculator']}>
              <div className={styles['top']}>
                <div className={styles['change-amount']}>
                  <p>£{changeAmount}</p>
                </div>
                <input
                  type="text"
                  placeholder="Charge amount"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>
              <ul className={styles['keys']}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, 'Back'].map((k, i) => {
                  return (
                    <li key={i}>
                      <button onClick={() => handleKeyPress(k)}>{k}</button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div className={styles['bottom']}>
              {totalCost <= 0 ? (
                <button onClick={() => handleFinish()}>Finish</button>
              ) : (
                <button onClick={handleContinue}>Continue</button>
              )}
            </div>
        </div>
      </div>
    </div>
  )
}