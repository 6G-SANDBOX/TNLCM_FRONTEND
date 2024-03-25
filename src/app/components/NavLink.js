'use client'

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { clearAuthTokens } from "../lib/jwtHandler";
import styles from './NavLink.module.css';

export default function NavLink() {
    const router = useRouter();

    const handleLogout = () => {
        clearAuthTokens();
        router.push('/tnlcm/login');
    };

    const navLinks = [
        { name: "Dashboard", href: "/tnlcm/dashboard" },
        { name: "Trial Networks", subMenu: [
            { name: "Create Trial Network", href: "/tnlcm/dashboard/trial_networks/create" },
            { name: "List Trial Networks", href: "/tnlcm/dashboard/trial_networks/list" }
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
        <nav className={styles.nav}>
            <div className={styles.logoContainer}>
                <Image className={styles.logo} src="/TNLCM.png" alt="TNLCM Logo" width={80} height={80} priority />
            </div>
            {navLinks.map((link, index) => (
                <div key={link.name} onClick={link.onClick}>
                    {link.subMenu ? (
                        <div>
                            <p className={`${styles.navLink} ${activeSubMenu === index ? styles.active : ''}`} onClick={() => handleSubMenuToggle(index)}>
                                {link.name} {activeSubMenu === index ? <span className={styles.arrowUp}>▲</span> : <span className={styles.arrowDown}>▼</span>}
                            </p>
                            {activeSubMenu === index && (
                                <div className={styles.subMenu}>
                                    {link.subMenu.map((subLink) => (
                                        <Link key={subLink.name} href={subLink.href}>
                                            <p className={`${styles.subNavLink} ${styles.navLink}`}>{subLink.name}</p>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link href={link.href}>
                            <p className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`} onClick={() => handleLinkClick(index, link.subMenu)}>{link.name}</p>
                        </Link>
                    )}
                </div>
            ))}
            <div className={styles.logoutContainer}>
                <p className={`${styles.navLink} ${styles.logout}`} onClick={handleLogout}>Logout</p>
            </div>
        </nav>
    );
};