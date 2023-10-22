import React, { useEffect } from 'react'
import styles from './index.module.css'
import { useUsers } from '../../contexts/UsersContext'

export default function Customers() {

  const { users, getUsers } = useUsers()

  useEffect(() => {
    getUsers()
  }, [])

  return (
    <section className={styles['customers-section']}>
      <div className={styles['customers']}>
        <table className={styles['customer-list']}>
          <thead className={styles['table-heading']}>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone number</th>
            </tr>
          </thead>
          <tbody className={styles['table-body']}>
            {users?.map((u, i) => {
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