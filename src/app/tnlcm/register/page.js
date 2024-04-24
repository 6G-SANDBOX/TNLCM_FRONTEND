"use client"

import CustomForm from "@/components/elements/CustomForm";
import useRegister from "@/hooks/useRegister";

export default function RegisterPage() {
  const {
    username,
    setUsername,
    password,
    setPassword,
    email,
    setEmail,
    verificationToken,
    setVerificationToken,
    org,
    setOrg,
    loading,
    handleRegister,
    handleKeyPress
  } = useRegister();

  const inputs = [
    {
      type: "text",
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
    },
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
      type: "text",
      placeholder: "Organization",
      value: org,
      onChange: (e) => setOrg(e.target.value),
      onKeyDown: handleKeyPress,
      className: "input-login-register-verification",
      required: true
    },
    {
      type: "text",
      placeholder: "Code",
      value: verificationToken,
      onChange: (e) => setVerificationToken(e.target.value),
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
      children: "Register"
    }
  ];

  return (
    <CustomForm
      onSubmit={handleRegister}
      loading={loading}
      containerClassName="login-register-verification-container"
      formClassName="login-register-verification-form"
      h1="Register in TNLCM"
      inputs={inputs}
      buttons={buttons}
    />
  );
};