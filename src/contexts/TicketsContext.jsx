import React, { useState, useContext, createContext, useEffect } from 'react';

const TicketsContext  = createContext();

export const TicketsProvider = ({ children }) => {

  const [tickets, setTickets] = useState([])
  const [recentTickets, setRecentTickets] = useState([])
  const [customerTickets, setCustomerTickers] = useState([])

  const [lastTicketNumber, setLastTicketNumber] = useState(0);

  const [ticketNumber, setTicketNumber] = useState(lastTicketNumber)

  useEffect(() => {
    setTicketNumber(lastTicketNumber)
  }, [lastTicketNumber])

  useEffect(() => {
    async function getTicketNumber() {
      try {
        await generateTicketNumber();
      } catch (error) {
        console.error("Error generating ticket number:", error);
      }
    }
    getTicketNumber();
  }, []);
  

  const updateTicketsData = async () => {
    try {
      const response = await window.api.getAllTickets();
      setTickets(response);
    } catch (error) {
      console.error('Error updating tickets data:', error);
    }
  };

  const generateTicketNumber = async () => {
    let newTicketNumber = lastTicketNumber + 1;
    try {
      while (await checkTicketNumberExists(newTicketNumber.toString().padStart(4, '0'))) {
        newTicketNumber++;
      }
      setLastTicketNumber(newTicketNumber);
      return newTicketNumber
    } catch (error) {
      console.error(error);
    }
  };
  
  const checkTicketNumberExists = async (ticketNumber) => {
    try {
      const response = await window.api.checkTicketNumberExists(ticketNumber);
      return response;
    } catch (error) {
      console.error(error);
      return false;
    }
  };
  
  const insertTicket = (ticketData) => {
    try {
      const response = window.api.insertTicket(ticketData)
      console.log(response)
      updateTicketsData()
    } catch (error) {
      console.error(error)
    }
  }

  const getTickets = async () => {
    try {
      const response = await window.api.getAllTickets();
      setTickets(response)
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const getRecentTickets = async () => {
    try {
      const response = await window.api.getRecentTickets();
      setRecentTickets(response)
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const getTicketForCustomer = async (phoneNumber) => {
    try {
      const response = await window.api.getTicketByPhone(phoneNumber)
      console.log(response)
      setCustomerTickers(response)
    } catch (error) {
      console.error(error)
    }
  };

  const setTicketToComplete = async (id) => {
    try {
      const response = await window.api.setTicketToComplete(id)
      console.log(response)
      updateTicketsData()
    } catch (error) {
      console.error(error)
    }
  };

  useEffect(() => {
    getTickets();
  }, []);

  return (
    <TicketsContext.Provider value={{ insertTicket, generateTicketNumber, ticketNumber, tickets, getTickets, getTicketForCustomer, customerTickets, setCustomerTickers, getRecentTickets, recentTickets, setTicketToComplete }}>
      {children}
    </TicketsContext.Provider>
  );
};

export const useTickets = () => useContext(TicketsContext);