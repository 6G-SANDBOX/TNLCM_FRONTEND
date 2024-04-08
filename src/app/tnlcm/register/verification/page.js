"use client"

import useVerificationRegister from "@/hooks/useVerificationRegister";
import Input from "@/components/elements/Input";
import Button from "@/components/elements/Button";
import styles from "./Verification.module.css"

export default function VerificationRegisterPage() {
  const {
    email,
    setEmail,
    handleVerificationRegister,
    handleKeyPress
  } = useVerificationRegister();

  return (
    <div className={styles["register-container"]}>
      <form onSubmit={handleVerificationRegister} className={styles["register-form"]}>
        <h1 className={styles["register-title"]}>Verification register</h1>
        <p>Please insert an email address to which you have access to. An email will be sent to your email address with the code to be inserted at the time of registration.</p>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyPress}
          className="input-login-register"
          required={true}
        />
        <Button type="submit" className="button-login-register">Generate code</Button>
      </form>
    </div>
  );
}