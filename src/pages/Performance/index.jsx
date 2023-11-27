import React, { useEffect } from 'react'
import styles from './index.module.css'
import { useTickets } from '../../contexts/TicketsContext'

export default function Performance() {

  const { getTodaysData, todaysData, totalPrices } = useTickets()

  useEffect(() => {
    getTodaysData()
  }, [])

  return (
    <section className={styles['performance-section']}>
      <div className={styles['performance']}>
        <h1>Performance Stats</h1>
        <ul className={styles['performance-list']}>
          <li className={styles['performance-item']}>
            <span className={styles['item-heading']}>Taken In*</span>
            <span className={styles['item-value']}>{todaysData.tickets}</span>
            <span className={styles['item-desc']}>The amount of items brought into the shop today.</span>
          </li>
          <li className={styles['performance-item']}>
            <span className={styles['item-heading']}>Earnings*</span>
            <span className={styles['item-value']}>£{totalPrices}</span>
            <span className={styles['item-desc']}>The amount of money earned today.</span>
          </li>
        </ul>
      </div>
    </section>
  )
}