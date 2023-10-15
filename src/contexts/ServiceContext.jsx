import React, { useState, useContext, createContext } from 'react';
import services from "../data/services.json"

const ServiceContext  = createContext();

export const ServiceProvider = ({ children }) => {
  const [service, setService] = useState([]);

  const changeService = (type) => {
    setService(services.services[type])
  }

  return (
    <ServiceContext.Provider value={{ service, changeService }}>
      {children}
    </ServiceContext.Provider>
  );
};

export const useService = () => useContext(ServiceContext);