import React from 'react'
import styles from './index.module.css'

export default function PerformanceTable({ performanceData }) {
  return (
    <table className={styles['performance-table']}>
      <thead className={styles['performance-header']}>
        <tr>
          <th>Date</th>
          <th>Taken In</th>
          <th>Earnings</th>
        </tr>
      </thead>
      <tbody>
        {performanceData.map((performance, index) => (
          <tr key={index}>
            <td>{performance.date}</td>
            <td>{performance.takenIn}</td>
            <td>{"£" + Math.abs(performance.earnings * 0.25).toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}