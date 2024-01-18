import React, { useState, useContext, createContext, useEffect } from 'react';

const PerformanceContext  = createContext();

export const PerformanceProvider = ({ children }) => {
  const [todaysPerformance, setTodaysPerformance] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [weeklyPerformance, setWeeklyPerformance] = useState([]);
  const [monthlyPerformance, setMonthlyPerformance] = useState([]);

  const [currentWeek, setCurrentWeek] = useState()
  
  const setTodaysPerformanceData = async () => {
    const response = await window.api.getTodaysPerformance()
    setTodaysPerformance(response)
  }

  const setPerformanceData = async () => {
    const response = await window.api.getAllPerformance()
    setPerformance(response)
  }

  const setWeeklyPerformanceData = async () => {
    const response = await window.api.getAllWeeklyPerformance()
    setWeeklyPerformance(response)
  }

  const setMonthlyPerformanceData = async () => {
    const response = await window.api.getMonthlyEarnings()
    setMonthlyPerformance(response)
  }

  const updatePerformance = async (take, price) => {
    const response = await window.api.updatePerformance({takenIn: take, earnings: price})
    // setPerformance(response)
  }

  const insertNewPerformance = async () => {
    await window.api.createNewDay()
  }

  function getWeekNumber() {
    const currentDate = new Date();
    const oneJan = new Date(currentDate.getFullYear(), 0, 1);
    const differenceInTime = currentDate - oneJan;
    const weekNumber = Math.ceil((differenceInTime / (7 * 24 * 60 * 60 * 1000)) + oneJan.getDay() / 7);
    return weekNumber;
}


  useEffect(() => {
    insertNewPerformance()
    setCurrentWeek(getWeekNumber)
    setMonthlyPerformanceData()
  }, [])

  useEffect(() => {
    setTodaysPerformanceData()
    setWeeklyPerformanceData()
    setPerformanceData()
  }, [todaysPerformance, performance])

  return (
    <PerformanceContext.Provider value={{ performance, todaysPerformance, updatePerformance, setTodaysPerformanceData, weeklyPerformance, monthlyPerformance, currentWeek }}>
      {children}
    </PerformanceContext.Provider>
  );
};

export const usePerformance = () => useContext(PerformanceContext);