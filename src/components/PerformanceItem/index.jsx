import React from 'react'
import styles from './index.module.css'

export default function PerformanceItem({ heading, value, desc, active }) {
  return (
    <li className={`${styles['performance-item']} ${active && styles["active"]}`}>
      <span className={styles['item-heading']}>{heading}</span>
      <span className={styles['item-value']}>{value}</span>
      <span className={styles['item-desc']}>{desc}</span>
    </li>
  )
}