import React, { forwardRef, useEffect, useRef, useState } from 'react'
import styles from './index.module.css'
import { useReactToPrint } from 'react-to-print';
import PaymentForm from '../PaymentForm';

export default function ReceiptPreview({ data, setPreview, setTicketData }) {
  const receiptRef = useRef();
  const [newPreview, setNewPreview] = useState()
  
  const handlePrint = useReactToPrint({
    pageStyle: "@page { size: auto;  margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact; } }",
    content: () => receiptRef.current
  })

  const handleClose = () => {
    setPreview(false)
    setTicketData([])
  }

  return (
    <div className={styles['overlay']}>
      <div className={styles['outer']}>
        <button onClick={() => handleClose()} className={styles['close-btn']}>&times;</button>
        <Receipt ref={receiptRef} data={data}/>
      </div>
      <div className={styles['form-buttons']}>
        <button onClick={() => handleClose()} type='button'>Cancel</button>
        <button onClick={async () => {
          handlePrint()
          handleClose()
        }}>Print Receipt</button>
        {data.complete ? null : <button onClick={() => setNewPreview(true)} style={{gridColumn: "span 2", background: "var(--danger)"}}>Complete Ticket</button>}
      </div>
      {newPreview ? <PaymentForm setPreview={setNewPreview} data={data} /> : null}
    </div>
  )
}

const Receipt = forwardRef(({ data }, ref) => {
  return (
    <div ref={ref} className={styles['receipt']}>
      <div className={styles['heading']}>
        <p className={`${styles['xl']} ${styles["title"]}`}>smart n up</p>
        <p className={`${styles['xl']} ${styles["title"]}`}>Dry Cleaners</p>
        <p className={styles['info']}>1 hazelwood court london n13 5ey</p>
        <p className={styles['info']}>TEL NO: 020 8886 6385</p>
      </div>
      <p className={styles['owner']}>SHOP COPY</p>
      <div className={styles['receipt-info']}>
        <p className={styles['ticket-date']}>reg<b>{data.day}</b>{data.date}</p>
        <div className={styles['ticket-no']}>
          <p>TKT: {data.ticketNo}</p>
          <p>{data.ownerMob}</p>
        </div>
        <ul className={styles['ticket-items']}>
          {data.items.map((i, x) => (
            <li key={x} className={styles['ticket-item']}>
              <div className={styles['ticket-item-name']}>  
                <p>{i.quantity} {i.name}</p>
                <p>{(i.quantity * i.price).toFixed(2)}</p>
              </div>
            </li>
          ))}
          <li className={styles['ticket-item']}>
            <div className={styles['ticket-item-name']}>  
              <p>{data.hasPaid ? "PAID" : "CASH"}</p>
              <p>{data.totalPrice.toFixed(2)}</p>
            </div>
          </li>
          <li className={styles['total-pieces']}>
            <p>{data.totalPieces} pieces</p>
            <p className={styles['note']}>note: all items left longer than 90 days will be given to charity</p>
          </li>
        </ul>
      </div>
    </div>
  )
})