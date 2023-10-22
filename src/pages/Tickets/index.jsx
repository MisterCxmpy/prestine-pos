import React, { useEffect } from 'react'
import styles from './index.module.css'
import { useTickets } from '../../contexts/TicketsContext'
import useSearch from '../../hooks/useSearch';

export default function Tickets() {

  const { tickets, getTickets } = useTickets()
  const { setQuery, result } = useSearch(tickets);

  useEffect(() => {
    getTickets()
  }, [])

  return (
    <section className={styles['tickets-section']}>
      <div className={styles['tickets']}>
        <input className={styles['search-bar']} onChange={(e) => setQuery(e.target.value)} type="text" />
        <table className={styles['tickets-list']}>
          <thead className={styles['table-heading']}>
            <tr>
              <th>Ticket NO</th>
              <th>Date</th>
              <th>Day</th>
              <th>Items</th>
              <th>Total Pieces</th>
              <th>Owner</th>
              <th>Owner Mobile</th>
            </tr>
          </thead>
          <tbody className={styles['table-body']}>
            {result?.map((t, i) => {
              return (
                <tr key={i}>
                  <td><div><b>{t.ticketNo}</b></div></td>
                  <td><div>{t.date}</div></td>
                  <td><div style={{textTransform: "uppercase"}}><b>{t.day}</b></div></td>
                  <td><div><ul>{t.items.map((i, id) => {
                    return (
                      <li key={id}>
                        {i.quantity}
                        &nbsp;
                        {i.name}
                      </li>
                    )
                  })}</ul></div></td>
                  <td><div><b>{t.totalPieces}</b></div></td>
                  <td><div><b>{t.ownerName}</b></div></td>
                  <td><div><b>{t.ownerMob}</b></div></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}