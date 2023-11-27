import React from 'react'
import styles from './index.module.css'

export default function PerformanceItem({ heading, value, desc }) {
  return (
    <li className={styles['performance-item']}>
      <span className={styles['item-heading']}>{heading}</span>
      <span className={styles['item-value']}>{value}</span>
      <span className={styles['item-desc']}>{desc}</span>
    </li>
  )
}