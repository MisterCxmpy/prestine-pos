import React, { forwardRef, useEffect, useRef, useState } from 'react'
import styles from './index.module.css'
import { useCheckout } from '../../contexts/CheckoutContext'
import { useReactToPrint } from 'react-to-print'

export default function FinalReceipt() {
  const [totalPieces, setTotalPieces] = useState(0);
  const { openCloseReceipt, checkout, total, hasPaid, day } = useCheckout();
  const receiptRef = useRef([]);

  useEffect(() => {
    const totalPiecesCount = checkout.reduce((acc, item) => acc + item.quantity, 0);
    setTotalPieces(totalPiecesCount);
  }, [checkout]);
  
  const handlePrint = useReactToPrint({
    pageStyle: "@page { size: auto;  margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact; } }",
    content: () => receiptRef.current
  })

  return (
    <div className={styles['overlay']}>
      <div className={styles['outer']}>
        <button onClick={() => openCloseReceipt(false)} className={styles['close-btn']}>&times;</button>
        <FullReceipt ref={receiptRef} checkout={checkout} total={total} totalPieces={totalPieces} hasPaid={hasPaid} day={day} />
      </div>
      <div className={styles['form-buttons']}>
        <button onClick={() => openCloseReceipt(false)} type='button'>Cancel</button>
        <button onClick={() => {
          handlePrint()
          openCloseReceipt(false)
          set
        }}>Print Receipt</button>
      </div>
    </div>
  );
}
const FullReceipt = forwardRef(({ checkout, total, totalPieces, hasPaid, day }, ref) => {
  let currentPiece = 1;

  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentDate = new Date();
      const formattedDateTime = `${currentDate.getDate().toString().padStart(2, '0')}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getFullYear()} ${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}`;
      setCurrentDateTime(formattedDateTime);
    }, 0);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div ref={ref} className={styles['receipt']}>
      <MainReceipt checkout={checkout} total={total} totalPieces={totalPieces} owner={false} hasPaid={hasPaid} day={day} currentDateTime={currentDateTime} />
      <PageBreak>&nbsp;</PageBreak>
      {checkout.map((c, i) => {
        const items = [];
        for (let index = 0; index < c.quantity; index++) {
          const itemNum = currentPiece;
          currentPiece += 1;
          items.push(
            <React.Fragment key={index}>
              <ItemReceipt name={c.name} quantity={c.quantity} itemNum={itemNum} total={totalPieces} tag={c.tag} day={day} currentDateTime={currentDateTime} />
              <PageBreak>&nbsp;</PageBreak>
            </React.Fragment>
          );
        }
        return items;
      })}
      <MainReceipt checkout={checkout} total={total} totalPieces={totalPieces} owner={true} hasPaid={hasPaid} day={day} currentDateTime={currentDateTime} />
    </div>
  )
});

const MainReceipt = ({ checkout, total, totalPieces, owner, hasPaid, day, currentDateTime }) => {

  return (
    <>
      <div className={styles['heading']}>
        <p className={`${styles['xl']} ${styles["title"]}`}>smart n up</p>
        <p className={`${styles['xl']} ${styles["title"]}`}>Dry Cleaners</p>
        <p className={styles['info']}>1 hazelwood court london n13 5ey</p>
        <p className={styles['info']}>TEL NO: 020 8886 6385</p>
      </div>
      <p className={styles['owner']}>{owner ? "SHOP COPY" : <>CUSTOMER<br />RECEIPT</>}</p>
      <div className={styles['receipt-info']}>
        <p className={styles['ticket-date']}>reg<b>{day}</b>{currentDateTime}</p>
        <div className={styles['ticket-no']}>
          <p>TKT: 6672</p>
          <p>066070</p>
        </div>
        <ul className={styles['ticket-items']}>
          {checkout.map((c, i) => (
            <li key={i} className={styles['ticket-item']}>
              <div className={styles['ticket-item-name']}>  
                <p>{c.quantity} {c.name}</p>
                <p>{(c.quantity * c.price).toFixed(2)}</p>
              </div>
              <ul>
                <li>
                  {c.tag}
                </li>
              </ul>
            </li>
          ))}
          <li className={styles['ticket-item']}>
            <div className={styles['ticket-item-name']}>  
              <p>{hasPaid ? "paid" : "cash"}</p>
              <p>{total.toFixed(2)}</p>
            </div>
          </li>
          <li className={styles['total-pieces']}>
            <p>{totalPieces} pieces</p>
            <p className={styles['note']}>note: all items left longer than 90 days will be given to charity</p>
          </li>
        </ul>
      </div>
    </>
  )
}

const ItemReceipt = forwardRef(({ name, quantity, itemNum, total, tag, day, currentDateTime }, ref) => {

  return (
    <div ref={ref} className={styles['receipt-info']}>
      <p className={styles['ticket-date']}>reg<b>{day}</b>{currentDateTime}</p>
        <div className={styles['ticket-no']}>
          <p>TKT: 6672</p>
          <p>066070</p>
        </div>
      <ul className={styles['ticket-items']}>
        <li className={styles['ticket-item']}>
          <div className={styles['ticket-item-name']}>
            <p>{quantity} {name}</p>
          </div>
          <ul>
            <li>
              {tag}
            </li>
          </ul>
        </li>
        <li className={styles['total-pieces']}>
          <p>{itemNum} / {total} pieces</p>
        </li>
      </ul>
    </div>
  );
});

function PageBreak() {
  return (
    <div className={styles['break']}></div>
  )
}