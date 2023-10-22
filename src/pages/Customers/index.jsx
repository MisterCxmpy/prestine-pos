import React, { useEffect, useState } from 'react';
import styles from './index.module.css';
import { useUsers } from '../../contexts/UsersContext';
import useSearch from '../../hooks/useSearch';
import { useTickets } from '../../contexts/TicketsContext';
import { ReceiptPreview, TicketsTable } from '../../components';

export default function Customers() {
  const { users, getUsers } = useUsers();
  const { getTicketForCustomer, customerTickets, setCustomerTickers } = useTickets();
  const { setQuery, result } = useSearch(users, "customer");

  const [selectedUser, setSelectedUser] = useState({});
  const [preview, setPreview] = useState(false)
  const [ticketData, setTicketData] = useState([])

  const handleRowClick = (u) => {
    setSelectedUser(u);
    getTicketForCustomer(u.ownerMob);
  };

  useEffect(() => {
    getUsers();
    setCustomerTickers([]);
    setSelectedUser({})
  }, []);

  const renderTableRows = () => {
  if (customerTickets.length > 0) {
    return (
      <React.Fragment>
        <tbody className={styles['table-body']}>
          <tr>
            <td className={styles['userID']}>{selectedUser.userID}</td>
            <td className={styles['ownerName']}><b>{selectedUser.ownerName}</b></td>
            <td className={styles['ownerMob']}><b>{selectedUser.ownerMob}</b></td>
          </tr>
        </tbody> 
        <TicketsTable result={customerTickets} setPreview={setPreview} setTicketData={setTicketData} />
      </React.Fragment>
    );
  } else {
    return (
      <tbody className={styles['table-body']}>
        {result?.map((u, i) => (
          <tr key={i} onClick={() => handleRowClick(u)}>
            <td className={styles['userID']}>{u.userID}</td>
            <td className={styles['ownerName']}><b>{u.ownerName}</b></td>
            <td className={styles['ownerMob']}><b>{u.ownerMob}</b></td>
          </tr>
        ))}
      </tbody>
    );
  }
};


  return (
    <>
      <section className={styles['customers-section']}>
        <div className={styles['customers']}>
          {customerTickets.length === 0 ? 
            <input className={styles['search-bar']} onChange={(e) => setQuery(e.target.value)} placeholder='Search for Customer' type="text" /> 
            :
            <button className={styles['back-btn']} onClick={() => setCustomerTickers([])}>Back</button>
          }
          <table className={styles['customer-list']}>
            <thead className={styles['table-heading']}>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Phone number</th>
              </tr>
            </thead>
            {renderTableRows()}
          </table>
        </div>
      </section>
      {preview ? <ReceiptPreview data={ticketData} setPreview={setPreview} setTicketData={setTicketData} /> : null}
    </>
    
  );
}
