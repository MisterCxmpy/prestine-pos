import React, { useEffect, useRef, useState } from 'react'
import styles from './index.module.css'
import { FaRegTrashAlt } from "react-icons/fa"
import NewOrderItem from '../NewOrderItem'
import { useCheckout } from '../../contexts/CheckoutContext'

export default function CheckoutMenu() {

  const days = ["mon", "tue", "wed", "thurs", "fri", "sat"]

  const { checkout, total, removeAll, openCloseCustomerForm, toggleHasPaid, hasPaid, setDay, day } = useCheckout()

  const [receiptLength, setReceiptLength] = useState(0)

  const receiptListRef = useRef()

  const handleDayClick = (dayId) => {
    setDay(dayId);
  };

  useEffect(() => {
    setReceiptLength(receiptListRef.current.childNodes.length);
  }, [checkout])

  return (
    <div className={styles['receipts']}>
      <div className={styles['header']}>
        <p>New Order</p>
        <FaRegTrashAlt onClick={() => removeAll()} />
      </div>
      <ul ref={receiptListRef} className={styles['receipt-list']}>
        {checkout?.map((c, i) => <NewOrderItem itemData={c} key={i} />)} 
      </ul>
      <div className={styles['receipt-final']}>
        <div className={styles['receipt-row']}>
          <p>Total</p>
          <p>£{total.toFixed(2)}</p>
        </div>
        <div className={styles['receipt-grid']}>
          <button className={styles['receipt-btn']}>Open Till</button>
          <button onClick={() => toggleHasPaid()} className={`${styles['receipt-btn']} ${hasPaid ? styles["paid"] : styles["not-paid"]}`}>Paid</button>
          <button onClick={() => openCloseCustomerForm(true)} className={styles['receipt-btn']} disabled={receiptLength <= 0 ? true : false}>Invoice</button>
          <button className={styles['receipt-btn']} disabled={receiptLength <= 0 ? true : false}>Confirm</button>
        </div>
        <div className={styles['receipt-days-grid']}>
          {days.map((d, i) => {
            return (
              <button key={i} className={`${styles['receipt-btn']} ${styles["day"]} ${day === d ? styles["active"] : ""}`}
              onClick={() => handleDayClick(d)}
              
              >{d}</button>
            )
          })}
        </div>
      </div>
    </div>
  )
}