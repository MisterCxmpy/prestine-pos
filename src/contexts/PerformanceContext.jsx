import React, { useState, useContext, createContext, useEffect } from 'react';

const PerformanceContext  = createContext();

export const PerformanceProvider = ({ children }) => {
  const [todaysPerformance, setTodaysPerformance] = useState([]);
  const [performance, setPerformance] = useState([]);
  
  const setTodaysPerformanceData = async () => {
    const response = await window.api.getTodaysPerformance()
    setTodaysPerformance(response)

    console.log(response)
  }

  const setPerformanceData = async () => {
    const response = await window.api.getAllPerformance()
    setPerformance(response)
  }

  const updatePerformance = async (take, price) => {
    const response = await window.api.updatePerformance({takenIn: take, earnings: price})
    // setPerformance(response)
  }

  const insertNewPerformance = async () => {
    await window.api.createNewDay()
  }

  useEffect(() => {
    insertNewPerformance()
  }, [])

  useEffect(() => {
    setTodaysPerformanceData()
    setPerformanceData()
  }, [todaysPerformance, performance])

  return (
    <PerformanceContext.Provider value={{ performance, todaysPerformance, updatePerformance, setTodaysPerformanceData }}>
      {children}
    </PerformanceContext.Provider>
  );
};

export const usePerformance = () => useContext(PerformanceContext);