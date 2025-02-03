import React, { forwardRef, useEffect, useRef, useState } from "react";
import styles from "./index.module.css";
import { useCheckout } from "../../contexts/CheckoutContext";
import { useReactToPrint } from "react-to-print";
import { useTickets } from "../../contexts/TicketsContext";
import { useUsers } from "../../contexts/UsersContext";
import { usePerformance } from "../../contexts/PerformanceContext";
import { useService } from "../../contexts/ServiceContext";
import Overlay from "../Overlay";

const itemMultiplierConfig = {
  "2 pcs suit": 2,
  "track suit": 2,
  "3 pcs suit": 3,
};

export default function FinalReceipt() {
  const [totalPieces, setTotalPieces] = useState(0);
  const {
    openCloseReceipt,
    checkout,
    total,
    paidAmount,
    hasPaid,
    day,
    customerDetails,
    discountValue,
    discountType,
    discount,
    completeCheckout,
  } = useCheckout();
  const { insertTicket, ticketNumber } = useTickets();
  const { updatePerformance } = usePerformance();
  const { insertUser } = useUsers();
  const receiptRef = useRef([]);

  useEffect(() => {
    const totalPiecesCount = checkout.reduce((acc, item) => {
      const itemNameLowercase = item.name.toLowerCase();
      const quantityMultiplier = itemMultiplierConfig[itemNameLowercase] || 1;
      const quantityToAdd = item.quantity * quantityMultiplier;

      return acc + quantityToAdd;
    }, 0);

    setTotalPieces(totalPiecesCount);
  }, [checkout]);

  const handlePrint = useReactToPrint({
    pageStyle:
      "@page { size: auto;  margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact; } }",
    content: () => receiptRef.current,
  });

  const finishReceipt = async () => {
    handlePrint();
    openCloseReceipt(false);

    const date = new Date()
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-");

    const ticket = {
      ticketNo:
        ticketNumber < 10000
          ? ticketNumber.toString().padStart(4, "0")
          : ticketNumber,
      date: currentDateTime,
      dateOnly: date,
      day: day,
      items: checkout,
      totalPieces: totalPieces,
      ...customerDetails,
      hasPaid: hasPaid,
      totalPrice: total,
      complete: false,
      discount: discount,
    };

    insertTicket(ticket);
    insertUser({ ...customerDetails, tickets: [ticket] });
    updatePerformance(totalPieces, paidAmount);
    completeCheckout();
  };

  const [currentDateTime, setCurrentDateTime] = useState("");

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentDate = new Date();
      const formattedDateTime = `${currentDate
        .getDate()
        .toString()
        .padStart(2, "0")}-${(currentDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${currentDate.getFullYear()} ${currentDate
        .getHours()
        .toString()
        .padStart(2, "0")}:${currentDate
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
      setCurrentDateTime(formattedDateTime);
    }, 0);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleKeyPressEvent = (event) => {
      if (event.key === "Escape") {
        openCloseReceipt(false);
      } else if (event.key === "Enter") {
        finishReceipt();
      }
    };
    window.addEventListener("keydown", handleKeyPressEvent);

    return () => {
      window.removeEventListener("keydown", handleKeyPressEvent);
    };
  }, []);

  return (
    <Overlay onClose={() => openCloseReceipt(false)} >
      <div className={styles["outer"]}>
        <button
          onClick={() => openCloseReceipt(false)}
          className={styles["close-btn"]}
        >
          &times;
        </button>
        <FullReceipt
          ref={receiptRef}
          checkout={checkout}
          total={total}
          totalPieces={totalPieces}
          hasPaid={hasPaid}
          day={day}
          currentDateTime={currentDateTime}
          ticketNumber={ticketNumber}
          phoneNum={customerDetails.ownerMob}
          name={customerDetails.ownerName}
          discountValue={discountValue}
          discountType={discountType}
          discount={discount}
        />
      </div>
      <div className={styles["form-buttons"]}>
        <button onClick={() => openCloseReceipt(false)} type="button">
          Cancel
        </button>
        <button onClick={() => finishReceipt()}>Print Receipt</button>
      </div>
    </Overlay>
  );
}
const FullReceipt = forwardRef(
  (
    {
      checkout,
      total,
      totalPieces,
      hasPaid,
      day,
      currentDateTime,
      ticketNumber,
      phoneNum,
      name,
      discountValue,
      discountType,
      discount,
    },
    ref
  ) => {
    let currentPiece = 1;

    return (
      <div ref={ref} className={styles["receipt"]}>
        <MainReceipt
          checkout={checkout}
          total={total}
          totalPieces={totalPieces}
          owner={false}
          hasPaid={hasPaid}
          day={day}
          currentDateTime={currentDateTime}
          ticketNumber={ticketNumber}
          phoneNum={phoneNum}
          name={name}
          discountValue={discountValue}
          discountType={discountType}
          discount={discount}
        />
        <PageBreak>&nbsp;</PageBreak>
        {checkout.map((c, i) => {
          const items = [];

          const itemNameLowercase = c.name.toLowerCase();
          const quantityMultiplier =
            itemMultiplierConfig[itemNameLowercase] || 1;
          const quantity = c.quantity * quantityMultiplier;

          for (let index = 0; index < quantity; index++) {
            const itemNum = currentPiece;
            currentPiece += 1;

            items.push(
              <React.Fragment key={index}>
                <ItemReceipt
                  name={c.name}
                  quantity={c.quantity}
                  itemNum={itemNum}
                  total={totalPieces * 1}
                  tag={c.tag}
                  day={day}
                  currentDateTime={currentDateTime}
                  ticketNumber={ticketNumber}
                />
                <PageBreak>&nbsp;</PageBreak>
              </React.Fragment>
            );
          }
          return items;
        })}

        <MainReceipt
          checkout={checkout}
          total={total}
          totalPieces={totalPieces}
          owner={true}
          hasPaid={hasPaid}
          day={day}
          currentDateTime={currentDateTime}
          ticketNumber={ticketNumber}
          phoneNum={phoneNum}
          name={name}
          discountValue={discountValue}
          discountType={discountType}
          discount={discount}
        />
      </div>
    );
  }
);

const MainReceipt = ({
  checkout,
  total,
  totalPieces,
  owner,
  hasPaid,
  day,
  currentDateTime,
  ticketNumber,
  phoneNum,
  name,
  discountValue,
  discountType,
  discount,
}) => {
  return (
    <>
      <div className={styles["heading"]}>
        <div>
          <p className={`${styles["xl"]} ${styles["title"]}`}>smart n up</p>
          <p className={`${styles["xl"]} ${styles["title"]}`}>Dry Cleaners</p>
        </div>
        {owner ? (
          ""
        ) : (
          <>
            <p className={styles["info"]}>1 hazelwood court london n13 5ey</p>
            <p className={`${styles["info"]} ${styles["num"]}`}>
              TEL NO: 020 8886 6385
            </p>
          </>
        )}
      </div>
      <p className={styles["owner"]}>
        {owner ? "SHOP COPY" : <>CUSTOMER RECEIPT</>}
      </p>
      <div className={styles["receipt-info"]}>
        <p className={styles["ticket-date"]}>
          <span>{day}</span>
          {currentDateTime}
        </p>
        <div className={styles["ticket-no"]}>
          <p>TKT: {ticketNumber.toString().padStart(4, "0")}</p>
          {owner ? (
            <div className={styles["names"]}>
              <p>{name}</p>
              <p>{phoneNum}</p>
            </div>
          ) : null}
        </div>
        <ul className={styles["ticket-items"]}>
          {checkout.map((c, i) => (
            <li key={i} className={styles["ticket-item"]}>
              <div className={styles["ticket-item-name"]}>
                <p>
                  {c.quantity} {c.name}
                </p>
                <p>{(c.quantity * c.price).toFixed(2)}</p>
              </div>
            </li>
          ))}
          {discountValue !== 0 && (
            <li className={styles["ticket-item"]}>
              <div className={styles["ticket-item-name"]}>
                <p>DISCOUNT</p>
                <p>
                  {parseFloat(discountValue).toFixed(2)}{" "}
                  {discountType == "%" ? "%" : null}
                  {` (${total > 0 ? total.toFixed(2) : 0})`}
                </p>
              </div>
            </li>
          )}
          <li className={styles["ticket-item"]}>
            <div className={styles["ticket-item-name"]}>
              <p>{hasPaid ? "PAID" : "TO PAY"}</p>
              <p>
                {discountValue > 0 ? discount.toFixed(2) : total.toFixed(2)}
              </p>
            </div>
          </li>
          <li className={styles["total-pieces"]}>
            <p>{totalPieces} pieces</p>
            {owner ? (
              ""
            ) : (
              <p className={styles["note"]}>
                note: all items left longer than 90 days will be given to
                charity
              </p>
            )}
          </li>
        </ul>
      </div>
    </>
  );
};

const ItemReceipt = forwardRef(
  (
    { name, quantity, itemNum, total, tag, day, currentDateTime, ticketNumber },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`${styles["receipt-info"]} ${styles["item-receipt"]}`}
      >
        <p className={styles["ticket-date"]}>
          <span>{day}</span>
          {currentDateTime}
        </p>
        <div className={styles["ticket-no"]}>
          <p>TKT: {ticketNumber.toString().padStart(4, "0")}</p>
          <p>{ticketNumber.toString().padStart(4, "0")}</p>
        </div>
        <ul className={styles["ticket-items"]}>
          <li className={styles["ticket-item"]}>
            <div className={styles["ticket-item-name"]}>
              <p>
                {quantity} {name}
              </p>
              <p>{day}</p>
            </div>
          </li>
          <li className={styles["total-pieces"]}>
            <p>
              {itemNum} / {total} pieces
            </p>
          </li>
        </ul>
      </div>
    );
  }
);

function PageBreak() {
  return <div className={styles["break"]}></div>;
}
