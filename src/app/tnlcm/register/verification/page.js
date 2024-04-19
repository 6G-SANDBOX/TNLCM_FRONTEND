"use client"

import CustomForm from "@/components/elements/CustomForm";
import useVerification from "@/hooks/useVerification";

export default function RegisterVerificationPage() {
  const {
    email,
    setEmail,
    loading,
    handleRegisterVerification,
    handleKeyRegisterVerificationPress,
  } = useVerification();

  const inputs = [
    {
      type: "email",
      placeholder: "Email",
      value: email,
      onChange: (e) => setEmail(e.target.value),
      onKeyDown: handleKeyRegisterVerificationPress,
      className: "input-login-register-verification",
      required: true
    }
  ];

  const buttons = [
    {
      type: "submit",
      className: "button-login-register-verification",
      children: "Generate code"
    }
  ];

  const paragraphs = [
    <p key="1">Please insert an email address to which you have access to. An email will be sent to your email address with the code to be inserted at the time of registration.</p>,
  ];

  return (
    <CustomForm
      onSubmit={handleRegisterVerification}
      loading={loading}
      containerClassName="login-register-verification-container"
      formClassName="login-register-verification-form"
      h1="Verification register"
      paragraphs={paragraphs}
      inputs={inputs}
      buttons={buttons}
    />
  );
}