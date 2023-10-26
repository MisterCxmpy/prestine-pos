import React, { useState, useContext, createContext, useEffect } from 'react';

const TicketsContext  = createContext();

export const TicketsProvider = ({ children }) => {

  const [tickets, setTickets] = useState([])
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

  const getTicketForCustomer = async (phoneNumber) => {
    try {
      const response = await window.api.getTicketByPhone(phoneNumber)
      console.log(response)
      setCustomerTickers(response)
    } catch (error) {
      console.error(error)
    }
  };

  useEffect(() => {
    getTickets();
  }, []);

  return (
    <TicketsContext.Provider value={{ insertTicket, generateTicketNumber, ticketNumber, tickets, getTickets, getTicketForCustomer, customerTickets, setCustomerTickers }}>
      {children}
    </TicketsContext.Provider>
  );
};

export const useTickets = () => useContext(TicketsContext);