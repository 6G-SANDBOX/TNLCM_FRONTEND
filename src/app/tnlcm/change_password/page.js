"use client"

import useChangePassword from "@/hooks/useChangePassword";
import Button from "@/components/elements/Button";
import Input from "@/components/elements/Input";
import Loader from "@/components/elements/Loader";
import styles from "./ChangePassword.module.css";

export default function ChangePasswordPage() {
    const {
        password,
        setPassword,
        email,
        setEmail,
        resetToken,
        setResetToken,
        loading,
        handleChangePassword,
        handleKeyPress
    } = useChangePassword();

    return (
        <div className={styles["register-container"]}>
            {loading && <Loader />}
            <form onSubmit={handleChangePassword} className={styles["register-form"]}>
                <h1 className={styles["register-title"]}>Update password</h1>
                <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyPress}
                className="input-login-register"
                required={true}
                />
                <Input
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyPress}
                className="input-login-register"
                required={true}
                />
                <Input
                type="text"
                placeholder="Code"
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                onKeyDown={handleKeyPress}
                className="input-login-register"
                required={true}
                />
                <Button type="submit" className="button-login-register">Reset password</Button>
            </form>
        </div>
    );
};