// In your React component

import React, { useState, useContext, createContext, useEffect } from 'react';

const ServiceContext = createContext();

export const ServiceProvider = ({ children }) => {
  const [service, setService] = useState([]);
  const [serviceType, setServiceType] = useState("");
  const [services, setServices] = useState([]);

  const changeService = async (type) => {
    const allServicesObject = await window.api.getAllServices()

    const allOfTypeService = allServicesObject.filter((s) => s.category === type)

    setService(allOfTypeService);
    setServiceType(type);
  };

  const fetchAllServices = async () => {
    const allServicesObject = await window.api.getAllServices();
    if (allServicesObject) {
      setServices(allServicesObject);
    }
  };

  useEffect(() => {
    fetchAllServices();
  }, [service]);

  const moveService = async (fromIndex, toIndex) => {
    if (fromIndex === toIndex || toIndex < 0 || toIndex >= services.length) return;
  
    const updatedServiceList = [...services];
    const [movedItem] = updatedServiceList.splice(fromIndex, 1);
    updatedServiceList.splice(toIndex, 0, movedItem);
  
    setServices(updatedServiceList);
  
    await updateService(updatedServiceList);
  };
  
  
  const updateService = async (updatedServices) => {
    try {
      await window.api.updateService(updatedServices);
    } catch (error) {
      console.error("Failed to update services:", error);
    }
  };
  

  return (
    <ServiceContext.Provider value={{ services, service, serviceType, changeService, setService, fetchAllServices, moveService }}>
      {children}
    </ServiceContext.Provider>
  );
};

export const useService = () => useContext(ServiceContext);
