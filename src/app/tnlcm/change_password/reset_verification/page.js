"use client"

import useVerificationRegister from "@/hooks/useVerificationRegister";
import Input from "@/components/elements/Input";
import Button from "@/components/elements/Button";
import Loader from "@/components/elements/Loader";
import styles from "./ResetVerification.module.css"

export default function ResetVerificationRegisterCodePage() {
  const {
    email,
    setEmail,
    loading,
    handleVerificationRegister,
    handleResetVerificationRegister,
    handleKeyVerificationRegisterPress,
    handleKeyResetVerificationRegisterPress,
  } = useVerificationRegister();

  return (
    <div className={styles["register-container"]}>
      {loading && <Loader />}
      <form onSubmit={handleResetVerificationRegister} className={styles["register-form"]}>
        <h1 className={styles["register-title"]}>Reset verification code</h1>
        <p>Please insert an email address to which you have access to. An email will be sent to your email address with the code to be inserted at the time of registration.</p>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyResetVerificationRegisterPress}
          className="input-login-register"
          required={true}
        />
        <Button type="submit" className="button-login-register">Generate code</Button>
      </form>
    </div>
  );
}