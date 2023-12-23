import React, { useEffect } from 'react';
import Modal from '../Modal';
import { useUsers } from '../../contexts/UsersContext';
import useSearch from '../../hooks/useSearch';
import styles from './index.module.css';

export default function SearchCustomer({ onSelectCustomer, openClose, setOpenClose }) {
  const { users, getUsers } = useUsers();
  const { setQuery, result } = useSearch(users, 'customer');

  const handleSelectCustomer = (selectedUser) => {
    onSelectCustomer({
      ownerName: selectedUser.ownerName,
      ownerMob: selectedUser.ownerMob,
    });
  };

  useEffect(() => {
    getUsers()
  }, [])

  const renderTableRows = () => {
    return (
      <tbody className={styles['table-body']}>
        {result?.length > 0 ? (
          result.map((u, i) => (
            <tr key={i} onClick={() => handleSelectCustomer(u)}>
              <td className={styles['userID']}>{u.userID}</td>
              <td className={styles['ownerName']}><b>{u.ownerName}</b></td>
              <td className={styles['ownerMob']}><b>{u.ownerMob}</b></td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="3">No customers available</td>
          </tr>
        )}
      </tbody>
    );
  };

  return (
    <Modal openClose={openClose} setOpenClose={setOpenClose} >
      <div className={styles['customers-section']}>
        <div className={styles['customers']}>
          <input
            className={styles['search-bar']}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for Customer"
            type="text"
          />
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
      </div>
    </Modal>
  );
}
