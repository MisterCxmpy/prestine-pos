import React, { useEffect, useState } from 'react';
import styles from './index.module.css';
import { PerformanceItem, PerformanceTable } from '../../components';
import { usePerformance } from '../../contexts/PerformanceContext';
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';

export default function Performance() {
  const { performance, todaysPerformance, weeklyPerformance, monthlyPerformance, currentWeek, currentMonth } = usePerformance();

  const [weeklyDropdown, setWeeklyDropdown] = useState(false);
  const [monthlyDropdown, setMonthlyDropdown] = useState(false);

  const handleToggleWeeklyDropdown = () => {
    setWeeklyDropdown((prevState) => !prevState);
  };

  const handleToggleMonthlyDropdown = () => {
    setMonthlyDropdown((prevState) => !prevState);
  };

  return (
    <section className={styles['performance-section']}>
      <div className={styles['performance']}>
        <h1>Performance Stats</h1>
        <ul className={styles['performance-list']}>
          <PerformanceItem heading={'Taken In*'} value={todaysPerformance[0]?.takenIn} desc={'The amount of items brought into the shop today.'} />
          <PerformanceItem heading={'Earnings*'} value={`£${(Math.abs(todaysPerformance[0]?.earnings * 0.80)).toFixed(2)}`} desc={'The amount of money earned today.'} />
        </ul>
      </div>
      <div className={styles['performance']}>
        <div className={styles['header']}>
          <h2>Weekly Performance</h2>
          <button onClick={handleToggleWeeklyDropdown}>
            {weeklyDropdown ? <IoIosArrowDown /> : <IoIosArrowForward />}
          </button>
        </div>
        <ul className={styles['performance-list']}>
          {weeklyDropdown &&
            weeklyPerformance.map((weekData, index) => (
              <PerformanceItem
                key={index}
                heading={`Week ${index + 1}`}
                value={`£${(weekData.earnings * 0.80).toFixed(2)}`}
                desc={`Earnings for Week ${index + 1}`}
                active={currentWeek === index + 1}
              />
            ))}
        </ul>
      </div>
      <div className={styles['performance']}>
        <div className={styles['header']}>
          <h2>Monthly Performance</h2>
          <button onClick={handleToggleMonthlyDropdown}>
            {monthlyDropdown ? <IoIosArrowDown /> : <IoIosArrowForward />}
          </button>
        </div>
        <ul className={styles['performance-list']}>
          {monthlyDropdown &&
            monthlyPerformance.map((monthData, index) => (
              <PerformanceItem
                key={index}
                heading={`Month ${index + 1}`}
                value={`£${(monthData.totalEarnings * 0.80).toFixed(2)}`}
                desc={`Earnings for Month ${index + 1}`}
                active={currentMonth === index + 1}
              />
            ))}
        </ul>
      </div>
      <PerformanceTable performanceData={performance} />
    </section>
  );
}
