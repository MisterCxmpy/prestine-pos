import React from 'react'
import styles from './index.module.css'

export default function NewOrderItem({ itemData }) {
  
  return (
    <li className={styles['receipt-item']}>
      <div className={styles['receipt']}>
        <h1>{itemData.name}</h1>
        <h2>£{itemData.price.toFixed(2)}</h2>
      </div>
    </li>
  )
}