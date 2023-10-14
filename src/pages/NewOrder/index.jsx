import React from 'react'
import styles from './index.module.css'
import { FaRegTrashAlt } from "react-icons/fa"
import { NewOrderItem, NewOrderServiceItem } from '../../components'
import { useCheckout } from '../../contexts/CheckoutContext'

export default function NewOrder() {

  const { checkout, total } = useCheckout()

  return (
    <section className={styles['new-order']}>
      <div className={styles['services']}>
        <ul className={styles['service-list']}>
          <NewOrderServiceItem serviceName={"Trousers"} servicePrice={4.00}/>
          <NewOrderServiceItem serviceName={"Shirts"} servicePrice={2.10}/>
          <NewOrderServiceItem serviceName={"Suits"} servicePrice={6.00}/>
          <NewOrderServiceItem serviceName={"Jacket"} servicePrice={9.50}/>
          <NewOrderServiceItem serviceName={"Shorts"} servicePrice={3.00}/>
          <NewOrderServiceItem serviceName={"Dresses"} servicePrice={12.00}/>
        </ul>
      </div>
      <div className={styles['receipts']}>
        <div className={styles['header']}>
          <p>New Order</p>
          <FaRegTrashAlt />
        </div>
        <ul className={styles['receipt-list']}>
          {checkout.map((c, i) => <NewOrderItem itemData={c} key={i} />)} 
        </ul>
        <div className={styles['receipt-final']}>
          <div className={styles['receipt-row']}>
            <p>Tax 5.25%</p>
            <p>£0.00</p>
          </div>
          <div className={styles['receipt-row']}>
            <p>Subtotal</p>
            <p>£0.00</p>
          </div>
          <div className={styles['receipt-row']}>
            <p>Total</p>
            <p>£{total.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </section>
  )
}