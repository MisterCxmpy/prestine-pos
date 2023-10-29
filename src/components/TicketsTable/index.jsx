import React from 'react';
import styles from './index.module.css';

export default function TicketsTable({ result, setPreview, setTicketData }) {
  const handleRowClick = (ticket) => {
    setTicketData(ticket);
    setPreview(true);
  };

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
        {result?.map((t, i) => {
          console.log(result)
          return (
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
              <td><strong><span className={styles[t.complete ? "complete" : "not-complete"]}>{t.complete ? "Complete" : "Not Complete"}</span></strong></td>
            </tr>
          );
        })}
      </tbody>
    </>
  );
}
