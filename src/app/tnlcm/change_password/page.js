"use client"

import CustomForm from "@/components/elements/CustomForm";
import useChangePassword from "@/hooks/useChangePassword";

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

    const inputs = [
        {
            type: "email",
            placeholder: "Email",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            onKeyDown: handleKeyPress,
            className: "input-login-register-verification",
            required: true
        },
        {
            type: "password",
            placeholder: "New password",
            value: password,
            onChange: (e) => setPassword(e.target.value),
            onKeyDown: handleKeyPress,
            className: "input-login-register-verification",
            required: true
        },
        {
            type: "text",
            placeholder: "Code",
            value: resetToken,
            onChange: (e) => setResetToken(e.target.value),
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
            children: "Reset password"
        }
    ];

    return (
        <CustomForm
            onSubmit={handleChangePassword}
            loading={loading}
            containerClassName="login-register-verification-container"
            formClassName="login-register-verification-form"
            h1="Update password"
            inputs={inputs}
            buttons={buttons}
        />
    );
};