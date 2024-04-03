"use client"

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/elements/Button";
import Input from "@/components/elements/Input";
import useLogin from "@/hooks/useLogin";
import styles from "./Login.module.css";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { handleLogin, loading } = useLogin();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            alert("Username and password are required");
        }
        await handleLogin(username, password);
    };

    const handleKeyPress = async (e) => {
        if (e.key === "Enter") {
            await handleLogin(username, password);
        }
    };

    return (
        <div className={styles["login-container"]}>
            <form onSubmit={handleSubmit} className={styles["login-form"]}>
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