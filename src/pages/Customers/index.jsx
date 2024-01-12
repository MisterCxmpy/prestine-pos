import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import { useUsers } from "../../contexts/UsersContext";
import useSearch from "../../hooks/useSearch";
import { useTickets } from "../../contexts/TicketsContext";
import { ReceiptPreview, TicketsTable } from "../../components";

export default function Customers() {
  const { users, getUsers, updateUser, deleteUserById } = useUsers();
  const { getTicketForCustomer, customerTickets, setCustomerTickers } =
    useTickets();
  const { setQuery, result } = useSearch(users, "customer");


  const [selectedUser, setSelectedUser] = useState({});
  const [preview, setPreview] = useState(false);
  const [ticketData, setTicketData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editedOwnerName, setEditedOwnerName] = useState("");
  const [editedOwnerMob, setEditedOwnerMob] = useState("");

  const handleRowClick = (u) => {
    setSelectedUser(u)
    getTicketForCustomer(u.ownerMob);
    setEditMode(false); // Reset edit mode when selecting a new user
  };

  const handleEditClick = (e, u) => {
    e.stopPropagation();
    setSelectedUser(u);
    setEditMode(true);
    setEditedOwnerName(u.ownerName || "");
    setEditedOwnerMob(u.ownerMob || "");
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
    setCustomerTickers([]);
    setSelectedUser({});
    setEditMode(false); // Reset edit mode when component mounts
  }, []);

  const renderTableRows = () => {
    if (customerTickets.length > 0) {
      // Render table rows with editable fields in edit mode
      return (
        <React.Fragment>
          <tbody className={styles["table-body"]}>
            <tr>
              <td className={styles["userID"]}>{selectedUser.userID}</td>
              <td className={styles["ownerName"]}>
                {editMode ? (
                  <input
                    type="text"
                    value={editedOwnerName}
                    onChange={(e) => setEditedOwnerName(e.target.value)}
                  />
                ) : (
                  <b>{selectedUser.ownerName}</b>
                )}
              </td>
              <td className={styles["ownerMob"]}>
                {editMode ? (
                  <input
                    type="text"
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
      // Render regular table rows
      return (
        <tbody className={styles["table-body"]}>
          {result?.length > 0 ? (
            result.map((u, i) => (
              <tr key={i} onClick={() => handleRowClick(u)}>
                <td className={styles["userID"]}>{u.userID}</td>
                <td className={styles["ownerName"]}>
                  {editMode && selectedUser.userID === u.userID ? (
                    <input
                      type="text"
                      value={editedOwnerName}
                      onClick={(e) => {e.stopPropagation();}}
                      onChange={(e) => setEditedOwnerName(e.target.value)}
                    />
                  ) : (
                    <b>{u.ownerName}</b>
                  )}
                </td>
                <td className={styles["ownerMob"]}>
                  {editMode && selectedUser.userID === u.userID ? (
                    <input
                      type="text"
                      value={editedOwnerMob}
                      onClick={(e) => {e.stopPropagation();}}
                      onChange={(e) => setEditedOwnerMob(e.target.value)}
                    />
                  ) : (
                    <b>{u.ownerMob}</b>
                  )}
                </td>
                <div className={styles["buttons"]}>
                  <button type="button" onClick={(e) => handleEditClick(e, u)}>
                    Edit
                  </button>
                  {editMode && selectedUser.userID === u.userID ? (
                    <button type="button" onClick={(e) => {handleSaveClick(e, u)}}>
                      Save
                    </button>
                  ) : null}
                  <button type='button' onClick={(e) => {e.stopPropagation(); deleteUserById(u.userID)}}>Delete</button>
                </div>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No customers available</td>
            </tr>
          )}
        </tbody>
      );
    }
  };

  return (
    <>
      <section className={styles["customers-section"]}>
        <div className={styles["customers"]}>
          {customerTickets.length === 0 ? (
            <input
              className={styles["search-bar"]}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for Customer"
              type="text"
            />
          ) : (
            <button
              className={styles["back-btn"]}
              onClick={() => setCustomerTickers([])}
            >
              Back
            </button>
          )}
          <table className={styles["customer-list"]}>
            <thead className={styles["table-heading"]}>
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
