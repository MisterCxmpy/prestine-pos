import React, { useState, useContext, createContext, useEffect } from 'react';

const TicketsContext = createContext();

export const TicketsProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);
  const [todaysData, setTodaysData] = useState([]);
  const [recentTickets, setRecentTickets] = useState([]);
  const [customerTickets, setCustomerTickets] = useState([]);

  const [lastTicketNumber, setLastTicketNumber] = useState(0);
  const [totalPrices, setTotalPrices] = useState(0);

  const [ticketNumber, setTicketNumber] = useState(0);

  useEffect(() => {
    fetchLastTicketNumber();
  }, [tickets]);

  const fetchLastTicketNumber = async () => {
    try {
      const lastNumber = await window.api.getLastTicketNo();
      const newTicketNumber = lastNumber ? lastNumber + 1 : 1;
      setLastTicketNumber(lastNumber);
      setTicketNumber(newTicketNumber);
    } catch (error) {
      console.error("Error fetching last ticket number:", error);
    }
  };

  const updateTicketsData = async () => {
    try {
      const response = await window.api.getAllTickets();
      setTickets(response);
    } catch (error) {
      console.error('Error updating tickets data:', error);
    }
  };

  const insertTicket = async (ticketData) => {
    try {
      await window.api.insertTicket(ticketData);
      updateTicketsData();
    } catch (error) {
      console.error('Error inserting ticket:', error);
    }
  };

  const getTickets = async () => {
    try {
      const response = await window.api.getAllTickets();
      setTickets(response);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const getTodaysData = async () => {
    try {
      const response = await window.api.getTodaysData();
      setTodaysData(response);
      setTotalPrices((Math.abs(response.totalPrices)).toFixed(2));
    } catch (error) {
      console.error('Error fetching today\'s data:', error);
    }
  };

  const getRecentTickets = async () => {
    try {
      const response = await window.api.getRecentTickets();
      setRecentTickets(response);
    } catch (error) {
      console.error('Error fetching recent tickets:', error);
    }
  };

  const getTicketForCustomer = async (phoneNumber) => {
    try {
      const response = await window.api.getTicketByPhone(phoneNumber);
      setCustomerTickets(response);
    } catch (error) {
      console.error('Error fetching tickets for customer:', error);
    }
  };

  const deleteTicketById = async (ticketId) => {
    try {
      const response = await window.api.deleteTicketById(ticketId);
      if (response.success) {
        fetchLastTicketNumber();
        getTickets();
      } else {
        console.error(response.message);
      }
    } catch (error) {
      console.error('Error deleting ticket:', error);
    }
  };

  const setTicketToComplete = async (id) => {
    try {
      await window.api.setTicketToComplete(id);
      updateTicketsData();
    } catch (error) {
      console.error('Error setting ticket to complete:', error);
    }
  };

  return (
    <TicketsContext.Provider
      value={{
        insertTicket,
        ticketNumber,
        tickets,
        getTickets,
        getTicketForCustomer,
        customerTickets,
        setCustomerTickets,
        getRecentTickets,
        recentTickets,
        todaysData,
        setTicketToComplete,
        getTodaysData,
        totalPrices,
        setTotalPrices,
        deleteTicketById,
        fetchLastTicketNumber,
        lastTicketNumber
      }}
    >
      {children}
    </TicketsContext.Provider>
  );
};

export const useTickets = () => useContext(TicketsContext);
