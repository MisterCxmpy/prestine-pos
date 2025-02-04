import React, { useState } from "react";
import styles from "./index.module.css";
import { useCheckout } from "../../contexts/CheckoutContext";
import { useItem } from "../../contexts/ItemContext";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import useShortcut from "../../hooks/useShortcut";
import { MdSettings } from "react-icons/md";

export default function NewOrderServiceItem({
  id,
  serviceName,
  servicePrice,
  additional,
  tag,
  index,
  moveService,
}) {
  const serviceData = {
    id,
    name: serviceName,
    price: servicePrice,
    additional,
    tag,
  };
  const { openCheck, openDeleteCheck } = useCheckout();
  const { setOpenCloseUpdate, setSelectedItem } = useItem()

  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
    moveService(fromIndex, index)
  };

  return (
    <li
      className={`${styles["service-item"]} ${
        styles[tag === "press only" ? "pressOnly" : tag]
      }`}
      onClick={() => openCheck(serviceData)}
      draggable={true}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <button
        className={styles["update-service"]}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpenCloseUpdate(true);
          setSelectedItem(serviceData)
        }}
      >
        <MdSettings />
      </button>
      <button
        className={styles["delete-service"]}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          openDeleteCheck(serviceData);
        }}
      >
        &times;
      </button>
      <div className={styles["service"]}>
        <p>{serviceName}</p>
      </div>
    </li>
  );
}