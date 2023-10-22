import React, { useEffect } from 'react'
import styles from './index.module.css'
import { useTickets } from '../../contexts/TicketsContext'
import useSearch from '../../hooks/useSearch';
import { TicketsTable } from '../../components';

export default function Tickets() {

  const { tickets, getTickets } = useTickets()
  const { setQuery, result } = useSearch(tickets, "ticket");

  useEffect(() => {
    getTickets()
  }, [])

  return (
    <section className={styles['tickets-section']}>
      <div className={styles['tickets']}>
        <input className={styles['search-bar']} onChange={(e) => setQuery(e.target.value)} placeholder='Search for Ticket' type="text" />
        <table className={styles['tickets-list']}>
          <TicketsTable result={result} />
        </table>
      </div>
    </section>
  )
}