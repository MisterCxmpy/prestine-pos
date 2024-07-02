import React, { useEffect, useState } from 'react';
import styles from './index.module.css';
import useSearch from '../../hooks/useSearch';
import { Pagination, ReceiptPreview, TicketsTable } from '../../components';
import { useUsers } from '../../contexts/UsersContext';
import { useTickets } from '../../contexts/TicketsContext';

const ITEMS_PER_PAGE = 10; // Adjust as per your requirement

export default function Customers() {
  const { users, getUsers, updateUser, deleteUserById } = useUsers();
  const { getTicketForCustomer, customerTickets, setCustomerTickets } = useTickets();
  const { setQuery, result } = useSearch(users, 'customer');

  const [selectedUser, setSelectedUser] = useState({});
  const [preview, setPreview] = useState(false);
  const [ticketData, setTicketData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editedOwnerName, setEditedOwnerName] = useState('');
  const [editedOwnerMob, setEditedOwnerMob] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const handleRowClick = (u) => {
    setSelectedUser(u);
    getTicketForCustomer(u.ownerMob);
    setEditMode(false); // Reset edit mode when selecting a new user
  };

  const handleEditClick = (e, u) => {
    e.stopPropagation();
    setSelectedUser(u);
    setEditMode(true);
    setEditedOwnerName(u.ownerName || '');
    setEditedOwnerMob(u.ownerMob || '');
  };

  const handleSaveClick = (e, u) => {
    e.stopPropagation();
    updateUser({
      ownerName: editedOwnerName,
      newOwnerMob: editedOwnerMob,
      ownerMob: u.ownerMob,
    });
    setEditMode(false);
    getUsers();
  };

  useEffect(() => {
    getUsers();
    setCustomerTickets([]);
    setSelectedUser({});
    setEditMode(false);
  }, []);

  const renderTableRows = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentResults = result.slice(startIndex, endIndex);

    if (customerTickets.length > 0) {
      return (
        <React.Fragment>
          <tbody className={styles['table-body']}>
            <tr>
              <td className={styles['userID']}>{selectedUser.userID}</td>
              <td className={styles['ownerName']}>
                {editMode ? (
                  <input
                    type='text'
                    value={editedOwnerName}
                    onChange={(e) => setEditedOwnerName(e.target.value)}
                  />
                ) : (
                  <b>{selectedUser.ownerName}</b>
                )}
              </td>
              <td className={styles['ownerMob']}>
                {editMode ? (
                  <input
                    type='text'
                    value={editedOwnerMob}
                    onChange={(e) => setEditedOwnerMob(e.target.value)}
                  />
                ) : (
                  <b>{selectedUser.ownerMob}</b>
                )}
              </td>
            </tr>
          </tbody>
          <TicketsTable
            result={customerTickets}
            setPreview={setPreview}
            setTicketData={setTicketData}
          />
        </React.Fragment>
      );
    } else {
      return (
        <tbody className={styles['table-body']}>
          {currentResults.length > 0 ? (
            currentResults.map((u, i) => (
              <tr key={i} onClick={() => handleRowClick(u)}>
                <td className={styles['userID']}>{u.userID}</td>
                <td className={styles['ownerName']}>
                  {editMode && selectedUser.userID === u.userID ? (
                    <input
                      type='text'
                      value={editedOwnerName}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      onChange={(e) => setEditedOwnerName(e.target.value)}
                    />
                  ) : (
                    <b>{u.ownerName}</b>
                  )}
                </td>
                <td className={styles['ownerMob']}>
                  {editMode && selectedUser.userID === u.userID ? (
                    <input
                      type='text'
                      value={editedOwnerMob}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      onChange={(e) => setEditedOwnerMob(e.target.value)}
                    />
                  ) : (
                    <b>{u.ownerMob}</b>
                  )}
                </td>
                <td className={styles['buttons']}>
                  <button type='button' onClick={(e) => handleEditClick(e, u)}>
                    Edit
                  </button>
                  {editMode && selectedUser.userID === u.userID ? (
                    <button
                      type='button'
                      onClick={(e) => {
                        handleSaveClick(e, u);
                      }}
                    >
                      Save
                    </button>
                  ) : null}
                  <button
                    type='button'
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteUserById(u.userID);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan='4'>No customers available</td>
            </tr>
          )}
        </tbody>
      );
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(result.length / ITEMS_PER_PAGE);

  return (
    <>
      <section className={styles['customers-section']}>
        <div className={styles['customers']}>
          {customerTickets.length === 0 ? (
            <input
              autoFocus
              className={styles['search-bar']}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Search for Customer'
              type='text'
            />
          ) : (
            <button
              className={styles['back-btn']}
              onClick={() => setCustomerTickets([])}
            >
              Back
            </button>
          )}
          <table className={styles['customer-list']}>
            <thead className={styles['table-heading']}>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Phone number</th>
                <th>Actions</th>
              </tr>
            </thead>
            {renderTableRows()}
          </table>
          {result.length > ITEMS_PER_PAGE && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </section>
      {preview ? (
        <ReceiptPreview
          data={ticketData}
          setPreview={setPreview}
          setTicketData={setTicketData}
        />
      ) : null}
    </>
  );
}
