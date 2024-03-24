'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../../lib/apiHandler';
import { saveAccessTokenToLocalStorage, saveRefreshTokenToLocalStorage } from '../../lib/jwtHandler';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const tokens = await login(username, password);
            saveAccessTokenToLocalStorage(tokens['access_token']);
            saveRefreshTokenToLocalStorage(tokens['refresh_token']);
            router.push('/home');
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    return (
        <div>
            <h1>Log in</h1>
            <form onSubmit={handleLogin}>
                <input
                    type="username"
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Log in</button>
            </form>
            <p>Don't have an account? <a href="/tnlcm/register">Register</a></p>
        </div>
    );
};