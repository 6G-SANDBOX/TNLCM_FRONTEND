'use client'

import Link from "next/link";
import Image from "next/image";
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
        { name: "List Trial Networks", href: "/tnlcm/dashboard/list_trial_networks" },
        { name: "Settings", href: "/tnlcm/dashboard/settings" }
    ];

    const pathname = usePathname();
    
    return (
        <nav className={styles.nav}>
            <div className={styles.logoContainer}>
                <Image className={styles.logo} src="/TNLCM.png" alt="TNLCM Logo" width={80} height={80} priority />
            </div>
            {navLinks.map((link) => (
                <div key={link.name} onClick={link.onClick}>
                    <Link href={link.href}>
                        <p className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}>{link.name}</p>
                    </Link>
                </div>
            ))}
            <div className={styles.logoutContainer}>
                <p className={`${styles.navLink} ${styles.logout}`} onClick={handleLogout}>Logout</p>
            </div>
        </nav>
    );
};