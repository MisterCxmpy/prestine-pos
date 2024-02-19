import React, { useEffect, useState } from 'react'
import styles from './index.module.css'
import { useTickets } from '../../contexts/TicketsContext'
import useSearch from '../../hooks/useSearch';
import { ReceiptPreview, TicketsTable } from '../../components';

export default function RecentTickest() {

  const { recentTickets, getRecentTickets } = useTickets()
  const { setQuery, result } = useSearch(recentTickets, "ticket");

  const [preview, setPreview] = useState(false)
  const [ticketData, setTicketData] = useState([])

  useEffect(() => {
    getRecentTickets()
  }, [recentTickets])

  return (
    <>
      <section className={styles['tickets-section']}>
        <div className={styles['tickets']}>
          <input className={styles['search-bar']} onChange={(e) => setQuery(e.target.value)} placeholder='Search for Recent Ticket' type="text" />
          <table className={styles['tickets-list']}>
            <TicketsTable result={result} setPreview={setPreview} setTicketData={setTicketData} />
          </table>
        </div>
      </section>
      {preview ? <ReceiptPreview data={ticketData} setPreview={setPreview} setTicketData={setTicketData} /> : null}
    </>
  )
}