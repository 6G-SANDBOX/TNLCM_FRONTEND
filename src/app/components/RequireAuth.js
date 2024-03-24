'use client'

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getAccessTokenFromLocalStorage } from '../lib/jwtHandler';

export default function RequireAuth ({ children }) {
    const router = useRouter();
    
    const isRegisterPage = usePathname() === '/tnlcm/register';
    const isMainPage = usePathname() === '/';

    useEffect(() => {
        const accessToken = getAccessTokenFromLocalStorage();
        if (!isMainPage && !isRegisterPage && !accessToken) {
            router.push('/tnlcm/login');
        }
    }, []);

    return <>{children}</>;
};