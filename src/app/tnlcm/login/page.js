'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { loginUser } from '../../lib/apiHandler';
import { saveAccessTokenToLocalStorage, saveRefreshTokenToLocalStorage } from '../../lib/jwtHandler';
import styles from './Login.module.css';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            alert('All fields are required');
        }

        setLoading(true);

        try {
            const tokens = await loginUser(username, password);
            saveAccessTokenToLocalStorage(tokens['access_token']);
            saveRefreshTokenToLocalStorage(tokens['refresh_token']);
            router.push('/tnlcm/dashboard');
        } catch (error) {
            alert(error);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin(e);
        }
    };

    return (
        <div className={styles['login-container']}>
            <form onSubmit={handleLogin} className={styles['login-form']}>
                <h1 className={styles['login-title']}>Log in to TNLCM</h1>
                <Input
                    type="username"
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
                <Button type="submit" className="button-login-register" disabled={loading}>
                    {loading ? 'Logging in...' : 'Log in'}
                </Button>
            </form>
            <p>Don't have an account? <a href="/tnlcm/register">Register</a></p>
        </div>
    );
};