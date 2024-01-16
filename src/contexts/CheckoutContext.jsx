import React, { useState, useEffect, useContext, createContext } from "react";
import { CheckItem } from "../components";

const CheckoutContext = createContext();

export const CheckoutProvider = ({ children }) => {
  const [checkout, setCheckout] = useState([]);
  const [customerDetails, setCustomerDetails] = useState({});
  const [total, setTotal] = useState(0.0);
  const [discount, setDiscount] = useState(0.0);
  const [paidAmount, setPaidAmount] = useState(0.0);
  const [hasPaid, setHasPaid] = useState(false);
  const [discountValue, setDiscountValue] = useState(0);
  const [discountType, setDiscountType] = useState("%");

  const [customerPhone, setCustomerPhone] = useState("");
  const [customerName, setCustomerName] = useState("");

  const [day, setDay] = useState("mon");

  const [checkItemActive, setCheckItemActive] = useState(false);
  const [checkItem, setCheckItem] = useState([]);

  const [checkReceiptActive, setCheckReceiptActive] = useState(false);
  const [customerFormActive, setCustomerFormActive] = useState(false);
  const [discountFormActive, setDiscountFormActive] = useState(false);

  const completeCheckout = () => {
    setCheckout([])
    setCustomerDetails([])
    setDay("mon")
    setHasPaid(false)
    setPaidAmount(0.0)
    setDiscountValue(0);
    setDiscountType("%");
    setDiscount(0.0)
    setCustomerPhone("")
    setCustomerName("")
  }

  const addToCheckout = (item) => {
    const existingItemIndex = checkout.findIndex(
      (existingItem) => existingItem.id === item.id && existingItem.price === item.price
    );
  
    if (existingItemIndex !== -1) {
      const updatedCheckout = [...checkout];
      updatedCheckout[existingItemIndex] = {
        ...updatedCheckout[existingItemIndex],
        quantity: updatedCheckout[existingItemIndex].quantity + 1,
      };
      setCheckout(updatedCheckout);
    } else {
      setCheckout([...checkout, { ...item }]);
    }
  };
  
  const removeFromCheckout = (item) => {
    const existingItemIndex = checkout.findIndex(
      (existingItem) => existingItem.id === item.id && existingItem.price === item.price
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
  

  const removeAllOfType = (itemId, itemPrice) => {
    const updatedCheckout = checkout.filter(
      (item) => !(item.id === itemId && item.price === itemPrice)
    );
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

  const openCloseDiscountForm = (status) => {
    setDiscountFormActive(status);
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

  const updateDiscountTotal = (value) => {
    setDiscount(value);
  };

  const resetCustomerForm = () => {
    setCustomerName("")
    setCustomerPhone("")
  }

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
        paidAmount,
        setPaidAmount,
        toggleHasPaid,
        hasPaid,
        openCloseCustomerForm,
        customerFormActive,
        setCustomerDetails,
        setDay,
        day,
        completeCheckout,
        customerDetails,
        updateTotal,
        openCloseDiscountForm, 
        discountFormActive, 
        setDiscountValue,
        discountValue,
        setDiscountType,
        discountType,
        updateDiscountTotal,
        discount,
        setCustomerPhone,
        setCustomerName,
        customerPhone,
        customerName,
        resetCustomerForm
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => useContext(CheckoutContext);
