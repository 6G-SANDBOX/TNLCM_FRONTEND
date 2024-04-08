"use client"

import useRegister from "@/hooks/useRegister";
import Button from "@/components/elements/Button";
import Input from "@/components/elements/Input";
import styles from "./Register.module.css";

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
    handleRegister,
    handleKeyPress
  } = useRegister();

  return (
    <div className={styles["register-container"]}>
      <form onSubmit={handleRegister} className={styles["register-form"]}>
        <h1 className={styles["register-title"]}>Register in TNLCM</h1>
        <Input
          type="text"
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
          type="text"
          placeholder="Organization"
          value={org}
          onChange={(e) => setOrg(e.target.value)}
          onKeyDown={handleKeyPress}
          className="input-login-register"
          required={true}
        />
        <Input
          type="text"
          placeholder="Code"
          value={verificationToken}
          onChange={(e) => setVerificationToken(e.target.value)}
          onKeyDown={handleKeyPress}
          className="input-login-register"
          required={true}
        />
        <Button type="submit" className="button-login-register">Register</Button>
      </form>
    </div>
  );
};