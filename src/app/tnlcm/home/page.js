'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../../components/Button';
import { getTrialNetworks } from '../../lib/apiHandler';
import { getAccessTokenFromLocalStorage, clearAuthTokens } from '../../lib/jwtHandler';

export default function HomePage() {
    const [trialNetworks, setTrialNetworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    
    const handleLogout = () => {
        clearAuthTokens();
        router.push('/tnlcm/login');
    };

    async function fetchTrialNetworks() {
        try {
            const accessToken = await getAccessTokenFromLocalStorage();
            const response = await getTrialNetworks(accessToken);
            setTrialNetworks(response["tn_ids"]);
        } catch (error) {
            alert(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrialNetworks();
    }, []);

    return (
        <div>
            <h1>List of Trial Networks</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {trialNetworks.map((tnId, index) => (
                        <li key={index}>{tnId}</li>
                    ))}
                </ul>
            )}
            <Button onClick={handleLogout} className="button-login-register" disabled={loading}>
                {loading ? 'Logging out...' : 'Logout'}
            </Button>
        </div>
    );
};