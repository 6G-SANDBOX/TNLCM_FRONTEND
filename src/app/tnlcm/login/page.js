"use client"

import Link from "next/link";
import Button from "@/components/elements/Button";
import Input from "@/components/elements/Input";
import useLogin from "@/hooks/useLogin";
import styles from "./Login.module.css";

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

    return (
        <div className={styles["login-container"]}>
            <form onSubmit={handleLogin} className={styles["login-form"]}>
                <h1 className={styles["login-title"]}>Log in to TNLCM</h1>
                <Input
                    type="username"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="input-login-register"
                    required={true}
                />
                <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="input-login-register"
                    required={true}
                />
                <Button type="submit" className="button-login-register" disabled={loading}>
                    {loading ? "Logging in..." : "Log in"}
                </Button>
            </form>
            <p>Don't have an account? <Link href="/tnlcm/register">Register</Link></p>
        </div>
    );
};