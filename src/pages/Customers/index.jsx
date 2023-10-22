import React, { useEffect, useState } from 'react'
import styles from './index.module.css'
import { useUsers } from '../../contexts/UsersContext'
import useSearch from '../../hooks/useSearch';
import { useTickets } from '../../contexts/TicketsContext';
import { TicketsTable } from '../../components';

export default function Customers() {

  const { users, getUsers } = useUsers()
  const { getTicketForCustomer, customerTickets, setCustomerTickers } = useTickets()
  const { setQuery, result } = useSearch(users, "customer");

  const [selectedUser, setSelectedUser] = useState({
    userID: null,
    ownerName: null,
    ownerMob: null
  });

  const handleRowClick = (u) => {
    setSelectedUser({
      userID: u.userID,
      ownerName: u.ownerName,
      ownerMob: u.ownerMob
    });

    getTicketForCustomer(u.ownerMob)
  };

  useEffect(() => {
    getUsers()
  }, [])

  return (
    <section className={styles['customers-section']}>
      <div className={styles['customers']}>
        {customerTickets.length == 0 ? 
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
          {customerTickets.length == 0 ? 
          <tbody className={styles['table-body']}>
            {result?.map((u, i) => {
              return (
                <tr key={i} onClick={() => handleRowClick(u)} >
                  <td><div>{u.userID}</div></td>
                  <td><div><b>{u.ownerName}</b></div></td>
                  <td><div><b>{u.ownerMob}</b></div></td>
                </tr>
              )
            })}
          </tbody> 
          : 
          <>
            <tbody className={styles['table-body']}>
              <tr>
                <td><div>{selectedUser.userID}</div></td>
                <td><div><b>{selectedUser.ownerName}</b></div></td>
                <td><div><b>{selectedUser.ownerMob}</b></div></td>
              </tr>
            </tbody> 
            &nbsp;
            <TicketsTable result={customerTickets} />
          </>
          }
        </table>
      </div>
    </section>
  )
}