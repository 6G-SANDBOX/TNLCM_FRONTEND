"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import useLogout from "@/hooks/useLogout";
import styles from "@/components/modules/CustomNavLink.module.css";

export default function CustomNavLink() {

    const pathname = usePathname();
    const handleLogout = useLogout();
    const [activeSubMenu, setActiveSubMenu] = useState(false);
    const [activeMenu, setActiveMenu] = useState(false);

    const navLinks = [
        {
            name: "Trial Networks", subMenu: [
                { name: "Templates", href: "/tnlcm/dashboard/trial_networks/templates" },
                { name: "Create", href: "/tnlcm/dashboard/trial_networks/create" },
                { name: "Information", href: "/tnlcm/dashboard/trial_networks/information" },
                { name: "Report", href: "/tnlcm/dashboard/trial_networks/report" }
            ]
        },
        { name: "Calendar", href: "/tnlcm/dashboard/calendar" },
        { name: "Settings", href: "/tnlcm/dashboard/settings" }
    ];

    useEffect(() => {
        const isSubLink = navLinks.some((link) => link.subMenu && link.subMenu.some((subLink) => subLink.href === pathname));
        if (isSubLink) {
            setActiveSubMenu(true);
            setActiveMenu(false);
        } else {
            const isMainLink = navLinks.some((link) => link.href === pathname);
            if (isMainLink) {
                setActiveMenu(true);
                setActiveSubMenu(false);
            }
        }
    }, []);

    const handleActiveSubMenu = () => {
        if (activeSubMenu) {
            setActiveSubMenu(false);
        } else {
            setActiveMenu(false);
            setActiveSubMenu(true);
        }
    }

    const handleActiveMenu = () => {
        setActiveSubMenu(false);
        setActiveMenu(true);
    }

    return (
        <nav className={styles["navlink-container"]}>
            <div className={styles["navlink-logo-container"]}>
                <Link href="/tnlcm/dashboard">
                    <Image src="/TNLCM_LOGO.png" alt="TNLCM Logo" width={100} height={100} priority />
                </Link>
            </div>
            {navLinks.map((link) => (
                <div key={link.name} className={styles["navlink-menu"]}>
                    {link.subMenu ? (
                        <div key={link.subMenu.name} className={`${styles["navlink"]} ${pathname === link.href && activeSubMenu}`}>
                            <p onClick={() => handleActiveSubMenu()}>{link.name} {activeSubMenu ? <span>▲</span> : <span>▼</span>}</p>
                            {activeSubMenu && link.subMenu.map((subLink) => (
                                <Link key={subLink.name} className={styles["navlink-submenu"]} href={subLink.href}>
                                    <p className={`${styles["navlink"]} ${pathname === subLink.href && activeSubMenu && styles["active"]}`}>{subLink.name}</p>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <Link href={link.href} className={`${styles["navlink"]} ${pathname === link.href && activeMenu && styles["active"]}`} onClick={() => handleActiveMenu()}><p>{link.name}</p></Link>
                    )}
                </div>
            ))}
            <div className={styles["logout-container"]}>
                <p className={`${styles["navlink"]} ${styles["logout"]}`} onClick={handleLogout}>Logout</p>
            </div>
        </nav>
    );
};