import React, { useState, useContext, createContext } from 'react';
import services from "../data/services.json"
import { useEffect } from 'react';

const ServiceContext  = createContext();

export const ServiceProvider = ({ children }) => {
  const [service, setService] = useState([]);
  const [serviceType, setServiceType] = useState("");
  const [allServices, setAllServices] = useState([])

  const changeService = (type) => {
    setService(services.services[type])
    setServiceType(type)
  }

  useEffect(() => {
    if (services.services) {
      const allServicesArray = Object.values(services.services).reduce((accumulator, currentValue) => {
        return accumulator.concat(currentValue);
      }, []);
      setAllServices(allServicesArray);
    }
  }, []);

  return (
    <ServiceContext.Provider value={{ allServices, service, serviceType, changeService, setService }}>
      {children}
    </ServiceContext.Provider>
  );
};

export const useService = () => useContext(ServiceContext);