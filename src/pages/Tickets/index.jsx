import React, { useEffect, useState } from 'react';
import styles from './index.module.css';
import { useTickets } from '../../contexts/TicketsContext';
import useSearch from '../../hooks/useSearch';
import { Pagination, ReceiptPreview, TicketsTable } from '../../components';

const ITEMS_PER_PAGE = 50;

export default function Tickets() {
  const { tickets, getTickets } = useTickets();
  const { setQuery, result } = useSearch(tickets, "ticket");

  const [preview, setPreview] = useState(false);
  const [ticketData, setTicketData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (e) => {
    setCurrentPage(1)
    setQuery(e.target.value)
  }

  useEffect(() => {
    getTickets();
  }, []);

  const lastIndex = currentPage * ITEMS_PER_PAGE;
  const firstIndex = lastIndex - ITEMS_PER_PAGE;
  const visibleTickets = result.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(result.length / ITEMS_PER_PAGE);

  return (
    <>
      <section className={styles['tickets-section']}>
        <div className={styles['tickets']}>
          <input autoFocus className={styles['search-bar']} onChange={(e) => handleSearch(e)} placeholder='Search for Ticket' type="text" />
          <table className={styles['tickets-list']}>
            <TicketsTable result={visibleTickets} setPreview={setPreview} setTicketData={setTicketData} />
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
      {preview ? <ReceiptPreview data={ticketData} setPreview={setPreview} setTicketData={setTicketData} /> : null}
    </>
  );
}
