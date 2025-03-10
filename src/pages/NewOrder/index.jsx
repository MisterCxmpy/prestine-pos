import React, { forwardRef, useEffect, useRef, useState } from "react";
import styles from "./index.module.css";
import {
  CheckItem,
  CheckoutMenu,
  CustomerForm,
  DeleteItemModal,
  Discount,
  FinalReceipt,
  NewOrderServiceItem,
  NewOrderServiceType,
} from "../../components";
import { useCheckout } from "../../contexts/CheckoutContext";
import { useService } from "../../contexts/ServiceContext";
import useSearch from "../../hooks/useSearch";
import { useReactToPrint } from "react-to-print";

export default function NewOrder() {
  const {
    checkItemActive,
    checkReceiptActive,
    customerFormActive,
    discountFormActive,
    checkItem,
    checkout,
    checkDeleteItemActive,
    checkDeleteItem,
  } = useCheckout();
  const { services, setService, moveService } = useService();
  const { setQuery, result } = useSearch(services, "service");

  const [activeService, setActiveService] = useState(null);
  const emptyRef = useRef();

  const serviceTypes = [
    "cleaning",
    "press-only",
    "household",
    "alterations",
    "repairs",
  ];

  const handleServiceTypeClick = (serviceId) => {
    setActiveService(serviceId);
    setQuery("");
  };

  const handlePrint = useReactToPrint({
    pageStyle:
      "@page { size: 0mm 0mm;  margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact; } }",
    content: () => emptyRef.current,
  });

  useEffect(() => {
    setActiveService(null);
    setService([]);
    setQuery("");
  }, []);

  return (
    <>
      <section className={styles["new-order"]}>
        <div className={styles["services"]}>
          <ul className={styles["service-list"]}>
            {serviceTypes.map((s, i) => (
              <NewOrderServiceType
                key={i}
                serviceName={s}
                id={s}
                isActive={activeService === s}
                handleService={() => handleServiceTypeClick(s)}
              />
            ))}
          </ul>
          <div className={styles["controls"]}>
            <input
              className={styles["search-bar"]}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              placeholder="Search for Item"
              type="text"
            />
            <button
              onClick={() => handlePrint()}
              className={styles["receipt-btn"]}
            >
              Open Till
            </button>
          </div>
          <ul
            className={styles["service-items-list"]}
          >
            {result.map((s, i) => (
              <NewOrderServiceItem
                id={s.id}
                serviceName={s.name}
                servicePrice={s.price}
                additional={s.additional}
                tag={s.tag}
                key={i}
                index={i}
                moveService={moveService}
              />
            ))}
          </ul>
        </div>
        <CheckoutMenu />
        {checkItemActive ? <CheckItem item={checkItem} /> : null}
        {checkDeleteItemActive ? (
          <DeleteItemModal item={checkDeleteItem} />
        ) : null}
        {checkReceiptActive ? <FinalReceipt /> : null}
        {customerFormActive ? <CustomerForm item={checkout} /> : null}
        {discountFormActive ? <Discount item={checkout} /> : null}
      </section>
      <Empty ref={emptyRef} />
    </>
  );
}

const Empty = forwardRef((_, ref) => {
  return (
    <div
      style={{ width: "0", height: "-1px", overflow: "hidden" }}
      ref={ref}
    ></div>
  );
});
