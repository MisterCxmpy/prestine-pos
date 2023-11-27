import React, { useEffect } from 'react'
import styles from './index.module.css'
import { PerformanceItem, PerformanceTable } from '../../components'
import { usePerformance } from '../../contexts/PerformanceContext'

export default function Performance() {

  const { performance, todaysPerformance } = usePerformance()

  return (
    <section className={styles['performance-section']}>
      <div className={styles['performance']}>
        <h1>Performance Stats</h1>
        <ul className={styles['performance-list']}>
          <PerformanceItem heading={"Taken In*"} value={todaysPerformance[0]?.takenIn} desc={"The amount of items brought into the shop today."} />
          <PerformanceItem heading={"Earnings*"} value={"£" + (Math.abs(todaysPerformance[0]?.earnings)).toFixed(2)} desc={"The amount of money earned today."} />
        </ul>
      </div>
      <PerformanceTable performanceData={performance} />
    </section>
  )
}