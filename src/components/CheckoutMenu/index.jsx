import React, { forwardRef, useEffect, useRef, useState } from 'react'
import styles from './index.module.css'
import { FaRegTrashAlt } from "react-icons/fa"
import NewOrderItem from '../NewOrderItem'
import { useCheckout } from '../../contexts/CheckoutContext'
import { PaidForm } from '..'
import { useReactToPrint } from 'react-to-print'

export default function CheckoutMenu() {

  const days = ["mon", "tue", "wed", "thurs", "fri", "sat"]

  const { checkout, total, removeAll, openCloseCustomerForm, openCloseDiscountForm, toggleHasPaid, hasPaid, setDay, day, completeCheckout, discount, discountValue } = useCheckout()

  const [receiptLength, setReceiptLength] = useState(0)
  const [paidForm, setPaidForm] = useState(false)

  const receiptListRef = useRef()
  const emptyRef = useRef()

  const handlePrint = useReactToPrint({
    pageStyle: "@page { size: 0mm 0mm;  margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact; } }",
    content: () => emptyRef.current
  })

  const handleDayClick = (dayId) => {
    setDay(dayId);
  };

  useEffect(() => {
    setReceiptLength(receiptListRef.current.childNodes.length);
  }, [checkout])

  const handlePaid = () => {
    if (total < 1) return

    if (hasPaid) {
      setPaidForm(false)
      toggleHasPaid()
    } else {
      setPaidForm(true)
    }
  }

  return (
    <>
      <div className={styles['receipts']}>
        <div className={styles['header']}>
          <p>New Ticket</p>
          <FaRegTrashAlt onClick={() => removeAll()} />
        </div>
        <ul ref={receiptListRef} className={styles['receipt-list']}>
          {checkout?.map((c, i) => <NewOrderItem itemData={c} key={i} />)} 
        </ul>
        <div className={styles['receipt-final']}>
          <div className={styles['receipt-row']}>
            <p>Total</p>
            <button onClick={() => openCloseDiscountForm(true)} disabled={receiptLength <= 0 ? true : false}>Discount</button>
            <p>£{discountValue > 0 ? discount.toFixed(2) : total.toFixed(2)}</p>
          </div>
          <div className={styles['receipt-grid']}>
            <button onClick={() => handlePrint()} className={styles['receipt-btn']}>Open Till</button>
            <button onClick={() => handlePaid()} className={`${styles['receipt-btn']} ${hasPaid ? styles["paid"] : styles["not-paid"]}`}>Paid</button>
            <button onClick={() => openCloseCustomerForm(true)} className={styles['receipt-btn']} disabled={receiptLength <= 0 ? true : false}>Invoice</button>
            <button onClick={() => completeCheckout()} className={styles['receipt-btn']} disabled={receiptLength <= 0 ? true : false}>Clear</button>
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
      {paidForm ? <PaidForm setPreview={setPaidForm} price={total} /> : null}
      <Empty ref={emptyRef} />
    </>
  )
}

const Empty = forwardRef(({ }, ref) => {
  return (
    <div style={{width: "0", height: "fit-content", overflow: "hidden"}} ref={ref}>

    </div>
  )
})