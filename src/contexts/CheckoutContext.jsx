import React, { useState, useEffect, useContext, createContext } from 'react';

const CheckoutContext = createContext();

export const CheckoutProvider = ({ children }) => {
  const [checkout, setCheckout] = useState([]);
  const [total, setTotal] = useState(0);

  const addToCheckout = (item) => {
    setCheckout([...checkout, item]);
  };

  useEffect(() => {
    const newTotal = checkout.reduce((acc, item) => {
      return acc + item.price;
    }, 0);
    setTotal(newTotal);
  }, [checkout]);

  return (
    <CheckoutContext.Provider value={{ checkout, addToCheckout, total }}>
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => useContext(CheckoutContext);
