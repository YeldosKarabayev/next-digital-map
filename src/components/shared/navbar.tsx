"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {

    const pathname = usePathname();

    const isAdminPage = pathname?.includes("/admin");
    const isUserPage = pathname?.includes("/user");

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link href="/">
          <a className="navbar-brand">Next.js + Firebase</a>
        </Link>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link href={"/"}>
                <a className="nav-link">Главная</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href={"admin"}>
                <a className="nav-link">Админ</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href={"user"}>
                <a className="nav-link">Пользователь</a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};