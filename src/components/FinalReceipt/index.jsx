import React, { forwardRef, useEffect, useRef, useState } from 'react'
import styles from './index.module.css'
import { useCheckout } from '../../contexts/CheckoutContext'
import { useReactToPrint } from 'react-to-print'

export default function FinalReceipt() {
  const [totalPieces, setTotalPieces] = useState(0);
  const { openCloseReceipt, checkout, total } = useCheckout();
  const receiptRef = useRef([]);

  useEffect(() => {
    const totalPiecesCount = checkout.reduce((acc, item) => acc + item.quantity, 0);
    setTotalPieces(totalPiecesCount);
  }, [checkout]);

  const handlePrint = useReactToPrint({
    content: () => receiptRef.current
  });
  

  return (
    <div className={styles['overlay']}>
      <div className={styles['outer']}>
        <button onClick={() => openCloseReceipt(false)} className={styles['close-btn']}>&times;</button>
        <FullReceipt ref={receiptRef} checkout={checkout} total={total} totalPieces={totalPieces} />
      </div>
      <div className={styles['form-buttons']}>
        <button onClick={() => openCloseReceipt(false)} type='button'>Cancel</button>
        <button onClick={() => handlePrint()}>Print Receipt</button>
      </div>
    </div>
  );
}

const FullReceipt = forwardRef(({ checkout, total, totalPieces }, ref) => {
  return (
    <div ref={ref} className={styles['receipt']}>
      <div className={styles['heading']}>
        <p>smart n up</p>
        <p>Dry Cleaners</p>
        <p>1 hazelwood court london n13 5ey</p>
        <p>TEL NO: 020 8886 6385</p>
      </div>
      <p>CUSTOMER<br />RECEIPT</p>
      <div className={styles['receipt-info']}>
        <p>reg&nbsp;&nbsp;&nbsp;<b>SAT</b>&nbsp;&nbsp;&nbsp;30-06-2023 12:17&nbsp;&nbsp;&nbsp;066070</p>
        <p className={styles['ticket-no']}>TKT: 6672</p>
        <ul className={styles['ticket-items']}>
          {checkout.map((c, i) => (
            <li key={i} className={styles['ticket-item']}>
              <p>{c.quantity} {c.name}</p>
              <p>{(c.quantity * c.price).toFixed(2)}</p>
            </li>
          ))}
          <li className={styles['ticket-item']}>
            <p>cash</p>
            <p>{total.toFixed(2)}</p>
          </li>
          <li className={styles['total-pieces']}>
            <p>{totalPieces} pieces</p>
            <p className={styles['note']}>note: all items left longer than 90 days will be given to charity</p>
          </li>
        </ul>
      </div>
      <PageBreak>&nbsp;</PageBreak>
      {checkout.map((c) => {
        return(
          <>
            <ItemReceipt ref={ref} key={c.name} name={c.name} quantity={c.quantity} />
            <PageBreak>&nbsp;</PageBreak>
          </>
        )
      })}
    </div>
  )
})

const ItemReceipt = forwardRef(({ name, quantity }, ref) => {

  return (
    <div ref={ref} className={styles['receipt']}>
      <div className={styles['heading']}></div>
      <div className={styles['receipt-info']}>
        <p>reg&nbsp;&nbsp;&nbsp;<b>SAT</b>&nbsp;&nbsp;&nbsp;30-06-2023 12:17&nbsp;&nbsp;&nbsp;066070</p>
        <p className={styles['ticket-no']}>TKT: 6672</p>
        <ul className={styles['ticket-items']}>
          <li className={styles['ticket-item']}>
            <p>{quantity} {name}</p>
          </li>
        </ul>
      </div>
    </div>
  );
});

function PageBreak() {
  return (
    <div className={styles['break']}></div>
  )
}