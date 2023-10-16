import React, { useEffect, useRef, useState } from 'react'
import styles from './index.module.css'
import { FaRegTrashAlt } from "react-icons/fa"
import { NewOrderItem, NewOrderServiceItem, NewOrderServiceType } from '../../components'
import { useCheckout } from '../../contexts/CheckoutContext'
import { useService } from '../../contexts/ServiceContext'

export default function NewOrder() {

  const { checkout, total, removeAll } = useCheckout()
  const { service } = useService()

  const [receiptLength, setReceiptLength] = useState(0)

  const receiptListRef = useRef()

  useEffect(() => {
    setReceiptLength(receiptListRef.current.childNodes.length);
  }, [checkout])


  return (
    <section className={styles['new-order']}>
      <div className={styles['services']}>
        <ul className={styles['service-list']}>
          <NewOrderServiceType serviceName={"Cleaning"} id={"cleaning"}/>
          <NewOrderServiceType serviceName={"Press Only"} id={"press-only"}/>
          <NewOrderServiceType serviceName={"Cushions/Duvets Etc"} id={"household"}/>
          <NewOrderServiceType serviceName={"Alterations"} id={"alterations"}/>
        </ul>
        <ul className={styles['service-items-list']}>
          {service.map((s, i) => <NewOrderServiceItem serviceName={s.name} servicePrice={s.price} additional={s.additional} key={i} />)}
        </ul>
      </div>
      <div className={styles['receipts']}>
        <div className={styles['header']}>
          <p>New Order</p>
          <FaRegTrashAlt onClick={() => removeAll()} />
        </div>
        <ul ref={receiptListRef} className={styles['receipt-list']}>
          {checkout.map((c, i) => <NewOrderItem itemData={c} key={i} />)} 
        </ul>
        <div className={styles['receipt-final']}>
          <div className={styles['receipt-row']}>
            <p>Total</p>
            <p>£{total.toFixed(2)}</p>
          </div>
          <div className={styles['receipt-grid']}>
            <button className={styles['receipt-btn']}>Open Till</button>
            <button className={styles['receipt-btn']} disabled={receiptLength <= 0 ? true : false}>Invoice</button>
            <button className={styles['receipt-btn']} disabled={receiptLength <= 0 ? true : false}>Confirm</button>
          </div>
        </div>
      </div>
    </section>
  )
}