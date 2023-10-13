import React, { useState, useContext, createContext } from 'react';

const NavbarContext  = createContext();

export const NavbarProvider = ({ children }) => {
  const [menuOpen, setOpen] = useState();

  return (
    <NavbarContext.Provider value={{ menuOpen, setOpen }}>
      {children}
    </NavbarContext.Provider>
  );
};

export const useNavbar = () => useContext(NavbarContext);