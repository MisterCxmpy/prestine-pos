import React, { useState, useContext, createContext, useEffect } from 'react';

const TicketsContext  = createContext();

export const TicketsProvider = ({ children }) => {

  const [tickets, setTickets] = useState([])

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
      const response = await fetch(`http://localhost:3000/tickets/${ticketNumber}`);
      const data = await response.json()
      return data.exists;
    } catch (error) {
      console.error(error);
      return false;
    }
  };
  
  const insertTicket = (ticketData) => {
    const apiUrl = 'http://localhost:3000/tickets';

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify(ticketData),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Ticket inserted successfully:', data);
    })
    .catch(error => {
      console.error('Error inserting ticket:', error);
    });
  }

  const getTickets = async () => {
    try {
      const response = await fetch("http://localhost:3000/tickets");
      const data = await response.json();
      setTickets(data.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  useEffect(() => {
    getTickets();
  }, []);

  return (
    <TicketsContext.Provider value={{ insertTicket, generateTicketNumber, ticketNumber, tickets, getTickets }}>
      {children}
    </TicketsContext.Provider>
  );
};

export const useTickets = () => useContext(TicketsContext);