"use client"

import CustomForm from "@/components/elements/CustomForm";
import useVerification from "@/hooks/useVerification";

export default function ResetVerificationRegisterCodePage() {
  const {
    email,
    setEmail,
    loading,
    handleResetVerification,
    handleKeyResetVerificationPress,
  } = useVerification();

  const inputs = [
    {
      type: "email",
      placeholder: "Email",
      value: email,
      onChange: (e) => setEmail(e.target.value),
      onKeyDown: handleKeyResetVerificationPress,
      className: "input-login-register-verification",
      required: true
    }
  ];

  const buttons = [
    {
      type: "submit",
      className: "button-login-register-verification",
      disabled: loading,
      children: "Generate code"
    }
  ];

  const paragraphs = [
    <p key="1">Please insert an email address to which you have access to. An email will be sent to your email address with the code to be inserted at the time of registration.</p>
  ];

  return (
    <CustomForm
      onSubmit={handleResetVerification}
      loading={loading}
      containerClassName="login-register-verification-container"
      formClassName="login-register-verification-form"
      h1="Reset verification code"
      paragraphs={paragraphs}
      inputs={inputs}
      buttons={buttons}
    />
  );
};