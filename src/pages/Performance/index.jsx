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
            <span>Taken In: </span>
            <span>{todaysData.tickets}</span>
          </li>
          <li className={styles['performance-item']}>
            <span>Earnings: </span>
            <span>£{totalPrices}</span>
          </li>
        </ul>
      </div>
    </section>
  )
}