// In your React component

import React, { useState, useContext, createContext, useEffect } from 'react';

const ServiceContext = createContext();

export const ServiceProvider = ({ children }) => {
  const [service, setService] = useState([]);
  const [serviceType, setServiceType] = useState("");
  const [allServices, setAllServices] = useState([]);

  const changeService = async (type) => {
    const _service = await window.api.getAllServices()
    setService(_service[type]);
    setServiceType(type);
  };

  useEffect(() => {
    const fetchAllServices = async () => {
      const allServicesObject = await window.api.getAllServices();
      if (allServicesObject) {
        const allServicesArray = Object.values(allServicesObject).reduce((accumulator, currentValue) => {
          return accumulator.concat(currentValue);
        }, []);
        setAllServices(allServicesArray);
      }
    };

    fetchAllServices();
  }, [service]);

  return (
    <ServiceContext.Provider value={{ allServices, service, serviceType, changeService, setService }}>
      {children}
    </ServiceContext.Provider>
  );
};

export const useService = () => useContext(ServiceContext);
