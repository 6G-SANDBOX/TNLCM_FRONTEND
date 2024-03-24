'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { clearAuthTokens } from '@/app/lib/jwtHandler';

export default function LogoutPage() {
    const router = useRouter();

    useEffect(() => {
        clearAuthTokens();
        router.push('/tnlcm/login');
    }, []);

    return null;
};