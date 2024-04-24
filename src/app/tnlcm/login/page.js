"use client"

import { useEffect } from "react";
import Link from "next/link";
import CustomForm from "@/components/elements/CustomForm";
import useLogin from "@/hooks/useLogin";
import { clearAuthTokens } from "@/lib/jwtHandler";

export default function LoginPage() {
    const {
        username,
        setUsername,
        password,
        setPassword,
        loading,
        handleLogin,
        handleKeyPress
    } = useLogin();

    const fetchClearTokens = () => {
        try {
            clearAuthTokens()
        } catch (error) {
            alert(error);
        }
    };

    useEffect(() => {
        fetchClearTokens();
    }, []);

    const inputs = [
        {
            type: "username",
            placeholder: "Username",
            value: username,
            onChange: (e) => setUsername(e.target.value),
            onKeyDown: handleKeyPress,
            className: "input-login-register-verification",
            required: true
        },
        {
            type: "password",
            placeholder: "Password",
            value: password,
            onChange: (e) => setPassword(e.target.value),
            onKeyDown: handleKeyPress,
            className: "input-login-register-verification",
            required: true
        }
    ];

    const buttons = [
        {
            type: "submit",
            className: "button-login-register-verification",
            disabled: loading,
            children: "Log in"
        }
    ];

    const extraContent = [
        <p key="1">Don't have an account? <Link href="/tnlcm/register/verification">Register</Link></p>,
        <p key="2">Forgot your password? <Link href="/tnlcm/change_password/reset_verification">Change password</Link></p>
    ];

    return (
        <CustomForm
            onSubmit={handleLogin}
            loading={loading}
            containerClassName="login-register-verification-container"
            formClassName="login-register-verification-form"
            h1="Log in TNLCM"
            inputs={inputs}
            buttons={buttons}
            extraContent={extraContent}
        />
    );
};