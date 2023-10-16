import React from "react";
import styles from "./index.module.css";
import { useService } from "../../contexts/ServiceContext";
import { useState } from "react";
import { useEffect } from "react";

export default function NewOrderServiceType({ serviceName, id, isActive, handleService }) {
  const { changeService, setService } = useService();

  const [active, setActive] = useState(isActive)

  const handleServiceTypeClick = (id) => {
    if (isActive) {
      setService([]);
      setActive(false)
    } else {
      changeService(id);
      handleService(id); 
    }
  };

  useEffect(() => {
    setActive(isActive)
  }, [isActive])

  return (
    <li
      className={`${styles["service-type"]} ${active ? styles['active'] : ''}`}
      onClick={() => {handleServiceTypeClick(id)}}
    >
      <div className={styles["service"]}>
        <h1>{serviceName}</h1>
      </div>
    </li>
  );
}
