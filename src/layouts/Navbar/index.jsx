import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import { Link, Outlet } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { TbNewSection } from "react-icons/tb";
import { AiOutlineUser } from "react-icons/ai"
import { TiTicket } from "react-icons/ti"
import { MdOutlineRecentActors } from "react-icons/md"
import { useNavbar } from "../../contexts/NavbarContext";

export default function Navbar() {

  const [menuOpen, setMenuOpen] = useState(true)
  const { setOpen } = useNavbar()

  const menuItems = [
    { icon: <TbNewSection />, title: "New Order" },
    { icon: <AiOutlineUser />, title: "Customers" },
    { icon: <TiTicket />, title: "Ticket" },
    { icon: <MdOutlineRecentActors />, title: "Recent Orders" },
  ];

  useEffect(() => {
    setOpen(menuOpen)
  }, [menuOpen])

  return (
    <>
      <nav className={`${styles["sidebar"]} ${!menuOpen ? styles["closed"] : ""}`}>
        <div className={styles["logo-details"]}>
          <h1 className={styles["logo-name"]}>Pristine</h1>
          <GiHamburgerMenu className={styles["hamburger"]} onClick={() => setMenuOpen(!menuOpen)}/>
        </div>
        <ul className={styles["nav-list"]}>
          {menuItems.map((m, i) => (
            <li className={styles["nav-item"]} key={i}>
              <Link>
                {m.icon}
                <span className={styles["link"]}>{m.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <Outlet />
    </>
  );
}
