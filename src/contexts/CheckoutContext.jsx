import React, { useState, useEffect, useContext, createContext } from "react";
import { CheckItem } from "../components";

const CheckoutContext = createContext();

export const CheckoutProvider = ({ children }) => {
  const [checkout, setCheckout] = useState([]);
  const [customerDetails, setCustomerDetails] = useState({});
  const [total, setTotal] = useState(0.0);
  const [hasPaid, setHasPaid] = useState(false);

  const [day, setDay] = useState("mon");

  const [checkItemActive, setCheckItemActive] = useState(false);
  const [checkItem, setCheckItem] = useState([]);

  const [checkReceiptActive, setCheckReceiptActive] = useState(false);
  const [customerFormActive, setCustomerFormActive] = useState(false);

  const completeCheckout = () => {
    setCheckout([])
    setCustomerDetails([])
    setDay("mon")
    setHasPaid(false)
  }

  const addToCheckout = (item) => {
    const existingItem = checkout.find(
      (existingItem) => existingItem.id === item.id
    );

    if (existingItem) {
      const updatedCheckout = checkout.map((existingItem) =>
        existingItem.id === item.id
          ? { ...existingItem, quantity: existingItem.quantity + 1 }
          : existingItem
      );
      setCheckout(updatedCheckout);
    } else {
      setCheckout([...checkout, { ...item }]);
    }
  };

  const removeFromCheckout = (item) => {
    const existingItemIndex = checkout.findIndex(
      (existingItem) => existingItem.id === item.id
    );

    if (existingItemIndex !== -1) {
      const updatedCheckout = [...checkout];
      if (updatedCheckout[existingItemIndex].quantity > 1) {
        updatedCheckout[existingItemIndex] = {
          ...updatedCheckout[existingItemIndex],
          quantity: updatedCheckout[existingItemIndex].quantity - 1,
        };
      } else {
        updatedCheckout.splice(existingItemIndex, 1);
      }
      setCheckout(updatedCheckout);
    }
  };

  const removeAllOfType = (itemId) => {
    const updatedCheckout = checkout.filter((item) => item.id !== itemId);
    setCheckout(updatedCheckout);
  };

  const removeAll = () => {
    setCheckout([]);
  };

  const openCloseReceipt = (status) => {
    setCheckReceiptActive(status);
  };

  const openCloseCustomerForm = (status) => {
    setCustomerFormActive(status);
  };

  const openCheck = (item) => {
    setCheckItemActive(true);
    setCheckItem(item);
  };

  const closeCheck = () => {
    setCheckItemActive(false);
  };

  const toggleHasPaid = () => {
    setHasPaid(!hasPaid);
  };

  const updateTotal = (value) => {
    setTotal(value);
  };

  useEffect(() => {
    const newTotal = checkout.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);
    setTotal(newTotal);
  }, [checkout]);
  

  return (
    <CheckoutContext.Provider
      value={{
        checkout,
        addToCheckout,
        removeFromCheckout,
        removeAllOfType,
        removeAll,
        openCheck,
        checkItemActive,
        checkItem,
        closeCheck,
        checkReceiptActive,
        openCloseReceipt,
        total,
        toggleHasPaid,
        hasPaid,
        openCloseCustomerForm,
        customerFormActive,
        setCustomerDetails,
        setDay,
        day,
        completeCheckout,
        customerDetails,
        updateTotal
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => useContext(CheckoutContext);
