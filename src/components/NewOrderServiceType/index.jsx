import React, { useRef } from "react";
import styles from "./index.module.css";
import { useService } from "../../contexts/ServiceContext";
import { useState } from "react";
import { useEffect } from "react";

export default function NewOrderServiceType({ serviceName, id, isActive, handleService }) {
  const { changeService, setService } = useService();

  const [active, setActive] = useState(false)
  const serviceRef = useRef()

  const handleServiceTypeClick = (id) => {

    setActive(!active)

    if (active) {
      setService([]);
    } else {
      changeService(id);
      handleService(id); 
    }
  };

  useEffect(() => {
    if (!isActive) {
      serviceRef.current.classList.remove(styles["active"])
      setActive(false)
    }
  }, [isActive])


  return (
    <li
      className={`${styles["service-type"]} ${active ? styles['active'] : ''}`}
      onClick={() => {handleServiceTypeClick(id)}}
      ref={serviceRef}
    >
      <div className={styles["service"]}>
        <h1>{serviceName}</h1>
      </div>
    </li>
  );
}
