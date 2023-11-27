import React, { useEffect } from 'react'
import styles from './index.module.css'
import { useTickets } from '../../contexts/TicketsContext'
import { PerformanceItem } from '../../components'

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
          <PerformanceItem heading={"Taken In*"} value={todaysData.tickets} desc={"The amount of items brought into the shop today."} />
          <PerformanceItem heading={"Earnings*"} value={"$" + totalPrices} desc={"The amount of money earned today."} />
        </ul>
      </div>
    </section>
  )
}