import React from 'react'
import styles from './index.module.css'
import { FaRegTrashAlt } from "react-icons/fa"

export default function NewOrder() {
  return (
    <section className={styles['new-order']}>
      <div className={styles['services']}>
        <ul className={styles['service-list']}>
          <li className={styles['service-item']}>
            <div className={styles['service']}></div>
          </li>
        </ul>
      </div>
      <div className={styles['receipts']}>
        <div className={styles['header']}>
          <p>New Order</p>
          <FaRegTrashAlt />
        </div>
        <ul className={styles['receipt-list']}>
            <li className={styles['receipt-item']}>
              <div className={styles['receipt']}></div>
            </li>
          </ul>
          <div className={styles['receipt-final']}>
            
          </div>
      </div>
    </section>
  )
}