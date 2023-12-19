import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import { Link, NavLink, Outlet } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { TbNewSection } from "react-icons/tb";
import { AiOutlineUser } from "react-icons/ai"
import { TiTicket } from "react-icons/ti"
import { MdOutlineRecentActors } from "react-icons/md"
import { IoIosStats } from "react-icons/io"
import { useNavbar } from "../../contexts/NavbarContext";
import { useItem } from "../../contexts/ItemContext";

export default function Navbar() {

  const [menuOpen, setMenuOpen] = useState(true)
  const { setOpen } = useNavbar()
  const { openClose, setOpenClose } = useItem()

  const menuItems = [
    { icon: <TbNewSection />, title: "New Ticket", url: "/" },
    { icon: <AiOutlineUser />, title: "Customers", url: "customers" },
    { icon: <TiTicket />, title: "Ticket", url: "tickets" },
    { icon: <MdOutlineRecentActors />, title: "Recent Orders", url: "recent-orders" },
    { icon: <IoIosStats />, title: "Performance", url: "performance" },
    { icon: <TbNewSection />, title: "Add Item", url: "#", click: () => setOpenClose(!openClose) }
  ];

  useEffect(() => {
    setOpen(menuOpen)
  }, [menuOpen])

  return (
    <>
      <nav className={`${styles["sidebar"]} ${!menuOpen ? styles["closed"] : ""}`}>
        <div className={styles["logo-details"]}>
          <h1 className={styles["logo-name"]}>Prestine</h1>
          <GiHamburgerMenu className={styles["hamburger"]} onClick={() => setMenuOpen(!menuOpen)}/>
        </div>
        <ul className={styles["nav-list"]}>
          {menuItems.map((m, i) => (
            <li className={styles["nav-item"]} key={i}>
              <NavLink to={m.url} className={({isActive}) => (isActive ? m.title === "Add Item" ? null : styles["active"] : "")} onClick={m.click}>
                {m.icon}
                <span className={styles["link"]}>{m.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <Outlet />
    </>
  );
}
