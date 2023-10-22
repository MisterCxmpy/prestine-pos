import React, { useEffect } from 'react'
import styles from './index.module.css'
import { useUsers } from '../../contexts/UsersContext'
import useSearch from '../../hooks/useSearch';

export default function Customers() {

  const { users, getUsers } = useUsers()
  const { setQuery, result } = useSearch(users, "customer");

  useEffect(() => {
    getUsers()
  }, [])

  return (
    <section className={styles['customers-section']}>
      <div className={styles['customers']}>
        <input className={styles['search-bar']} onChange={(e) => setQuery(e.target.value)} placeholder='Search for Customer' type="text" />
        <table className={styles['customer-list']}>
          <thead className={styles['table-heading']}>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone number</th>
            </tr>
          </thead>
          <tbody className={styles['table-body']}>
            {result?.map((u, i) => {
              return (
                <tr key={i}>
                  <td><div>{u.userID}</div></td>
                  <td><div><b>{u.ownerName}</b></div></td>
                  <td><div><b>{u.ownerMob}</b></div></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}