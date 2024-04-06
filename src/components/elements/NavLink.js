"use client"

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import useLogout from "@/hooks/useLogout";
import styles from "@/components/modules/NavLink.module.css";

export default function NavLink() {

    const handleLogout = useLogout();

    const navLinks = [
        { name: "Dashboard", href: "/tnlcm/dashboard" },
        { name: "Trial Networks", subMenu: [
            { name: "Create trial network", href: "/tnlcm/dashboard/trial_networks/create" },
            { name: "List trial networks", href: "/tnlcm/dashboard/trial_networks/list" },
            { name: "Report trial networks", href: "/tnlcm/dashboard/trial_networks/report" }
        ]},
        { name: "Settings", href: "/tnlcm/dashboard/settings" }
    ];

    const pathname = usePathname();
    const [activeSubMenu, setActiveSubMenu] = useState(null);

    const handleSubMenuToggle = (index) => {
        setActiveSubMenu(activeSubMenu === index ? null : index);
    };

    const handleLinkClick = (index, hasSubMenu) => {
        setActiveSubMenu(hasSubMenu ? index : null);
    };

    return (
        <nav className={styles["navLink-container"]}>
            <div className={styles["logo-container"]}>
                <Image src="/TNLCM.png" alt="TNLCM Logo" width={80} height={80} priority />
            </div>
            {navLinks.map((link, index) => (
                <div key={link.name} onClick={link.onClick}>
                    {link.subMenu ? (
                        <div>
                            <p className={`${styles["navLink"]} ${activeSubMenu === index ? styles["active"] : ""}`} onClick={() => handleSubMenuToggle(index)}>
                                {link.name} {activeSubMenu === index ? <span>▲</span> : <span>▼</span>}
                            </p>
                            {activeSubMenu === index && (
                                <div>
                                    {link.subMenu.map((subLink) => (
                                        <Link key={subLink.name} href={subLink.href}>
                                            <p className={`${styles["navLink"]}`}>{subLink.name}</p>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link href={link.href}>
                            <p className={`${styles["navLink"]} ${pathname === link.href ? styles["active"] : ""}`} onClick={() => handleLinkClick(index, link.subMenu)}>{link.name}</p>
                        </Link>
                    )}
                </div>
            ))}
            <div className={styles["logout-container"]}>
                <p className={`${styles["navLink"]} ${styles["logout"]}`} onClick={handleLogout}>Logout</p>
            </div>
        </nav>
    );
};