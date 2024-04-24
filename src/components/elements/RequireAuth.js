"use client"

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getAccessTokenFromLocalStorage } from "@/lib/jwtHandler";

export default function RequireAuth({ children }) {
    const router = useRouter();
    
    const isRegisterPage = usePathname() === "/tnlcm/register";
    const isVerificationRegisterPage = usePathname() === "/tnlcm/register/verification";
    const isResetVerificationPage = usePathname() === "/tnlcm/register/change-password/reset-verification";
    const isChangePasswordPage = usePathname() === "/tnlcm/register/change-password";
    const isMainPage = usePathname() === "/";

    const isAuth = async () => {
        const accessToken = await getAccessTokenFromLocalStorage();
        if (!isMainPage && !isRegisterPage && !isVerificationRegisterPage && !isChangePasswordPage && !isResetVerificationPage && !accessToken) {
            router.push("/tnlcm/login");
        }
    };
    
    useEffect(() => {
        isAuth();
    }, []);

    return <>{children}</>
};