import React, { forwardRef, useEffect, useRef, useState } from 'react'
import styles from './index.module.css'
import { useReactToPrint } from 'react-to-print';
import PaymentForm from '../PaymentForm';
import { useTickets } from '../../contexts/TicketsContext';

export default function ReceiptPreview({ data, setPreview, setTicketData }) {

  const { setTicketToComplete } = useTickets()

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

  let content = null;

  if (newPreview) {
    if (data.hasPaid) {
      setTicketToComplete(data.id);
      handleClose()
    } else {
      content = <PaymentForm setPreview={setNewPreview} oldHandleClose={handleClose} data={data} />;
    }
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
      {newPreview ? content : null}
    </div>
  )
}

const Receipt = forwardRef(({ data }, ref) => {
  return (
    <div ref={ref} className={styles['receipt']}>
      <div className={styles['heading']}>
        <p className={`${styles['xl']} ${styles["title"]}`}>smart n up</p>
        <p className={`${styles['xl']} ${styles["title"]}`}>Dry Cleaners</p>
      </div>
      <p className={styles['owner']}>SHOP COPY</p>
      <div className={styles['receipt-info']}>
        <p className={styles['ticket-date']}>reg<b>{data.day}</b>{data.date}</p>
        <div className={styles['ticket-no']}>
          <p>TKT: {data.ticketNo}</p>
          <div className={styles['names']}>
              <p>{data.ownerName}</p>
              <p>{data.ownerMob}</p>
            </div>
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
              <p>{data.hasPaid ? "PAID" : "TO PAY"}</p>
              <p>{data.totalPrice.toFixed(2)}</p>
            </div>
          </li>
          <li className={styles['total-pieces']}>
            <p>{data.totalPieces} pieces</p>
          </li>
        </ul>
      </div>
    </div>
  )
})