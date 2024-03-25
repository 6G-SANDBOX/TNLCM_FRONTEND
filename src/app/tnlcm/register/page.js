'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/app/components/Button';
import Input from '@/app/components/Input';
import { registerUser } from '@/app/lib/apiHandler';
import styles from './Register.module.css';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [org, setOrg] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !password || !email || !org) {
      alert('All fields are required');
    }
    try {
      await registerUser(username, password, email, org);
      router.push('/tnlcm/login');
    } catch (error) {
      alert(error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleRegister(e);
    }
  };

  return (
    <div className={styles['register-container']}>
      <form onSubmit={handleRegister} className={styles['register-form']}>
        <h1 className={styles['register-title']}>Register in TNLCM</h1>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyPress}
          className="input-login-register"
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyPress}
          className="input-login-register"
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyPress}
          className="input-login-register"
        />
        <Input
          type="org"
          placeholder="Organization"
          value={org}
          onChange={(e) => setOrg(e.target.value)}
          onKeyDown={handleKeyPress}
          className="input-login-register"
        />
        <Button type="submit" className="button-login-register">Register</Button>
      </form>
    </div>
  );
};