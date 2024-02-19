import React, { useEffect } from 'react';
import styles from './index.module.css';

export default function SearchCustomer({ onSelectCustomer, result }) {

  const handleSelectCustomer = (selectedUser) => {
    onSelectCustomer({
      ownerName: selectedUser.ownerName,
      ownerMob: selectedUser.ownerMob,
    });
  };

  const renderTableRows = () => {
    return (
      <tbody className={styles['table-body']}>
        {result?.length > 0 ? (
          result.map((u, i) => (
            <tr key={i} onClick={() => handleSelectCustomer(u)}>
              <td className={styles['userID']}>{u.userID}</td>
              <td className={styles['ownerName']}>
                <b>{u.ownerName}</b>
              </td>
              <td className={styles['ownerMob']}>
                <b>{u.ownerMob}</b>
              </td>
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
    <div className={styles['outer']}>
      <div className={styles['customers-section']}>
        <div className={styles['customers']}>
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
    </div>
  );
}
