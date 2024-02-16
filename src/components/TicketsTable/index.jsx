import React from 'react';
import styles from './index.module.css';
import { useTickets } from '../../contexts/TicketsContext';

export default function TicketsTable({ result, setPreview, setTicketData }) {
  const handleRowClick = (ticket) => {
    setTicketData(ticket);
    setPreview(true);
  };

  const { deleteTicketById } = useTickets()

  return (
    <>
      <thead className={styles['table-heading']}>
        <tr>
          <th>Ticket NO</th>
          <th>Date</th>
          <th>Day</th>
          <th>Items</th>
          <th>Total Pieces</th>
          <th>Owner</th>
          <th>Owner Mobile</th>
          <th>PAID</th>
          <th>Complete</th>
        </tr>
      </thead>
      <tbody className={styles['table-body']}>
        {result?.length > 0 ? (
          result.map((t, i) => (
            <tr key={i} onClick={() => handleRowClick(t)}>
              <td><strong>{t.ticketNo}</strong></td>
              <td>{t.date}</td>
              <td style={{ textTransform: 'uppercase' }}>{t.day}</td>
              <td>
                <ul>
                  {t.items.map((item, id) => (
                    <li key={id}>
                      {item.quantity} &nbsp; {item.name}
                    </li>
                  ))}
                </ul>
              </td>
              <td>{t.totalPieces}</td>
              <td><strong>{t.ownerName}</strong></td>
              <td><strong>{t.ownerMob}</strong></td>
              <td>{t.hasPaid ? "Paid" : "Not Paid"}</td>
              <td><strong><span className={styles[t.complete ? "complete" : "not-complete"]}>{t.complete ? "Collected" : "Not Collected"}</span></strong></td>
              <div className={styles['buttons']}>
                <button type='button' onClick={(e) => {e.stopPropagation(); deleteTicketById(t.id)}}>Delete</button>
                <button type='button' onClick={(e) => {e.stopPropagation();}}>Edit</button>
              </div>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="3">No Tickets available</td>
          </tr>
        )}
      </tbody>
    </>
  );
}