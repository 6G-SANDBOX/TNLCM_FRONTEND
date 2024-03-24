'use client'

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getAccessTokenFromLocalStorage } from '../lib/jwtHandler';

export default function RequireAuth ({ children }) {
    const router = useRouter();
    
    const isRegisterPage = usePathname() === '/tnlcm/register';

    useEffect(() => {
        const accessToken = getAccessTokenFromLocalStorage();
        if (!isRegisterPage && !accessToken) {
            router.push('/tnlcm/login');
        }
    }, []);

    return <>{children}</>;
};