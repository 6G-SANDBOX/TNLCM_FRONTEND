'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getTrialNetworks } from '../../lib/apiHandler';
import { getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage } from '../../lib/jwtHandler';

export default function HomePage() {
    const [trialNetworks, setTrialNetworks] = useState([]);
    const router = useRouter()
    
    const handleLogout = () => {
        router.push('/tnlcm/logout');
    };

    async function fetchTrialNetworks() {
        try {
            const accessToken = getAccessTokenFromLocalStorage();
            const response = await getTrialNetworks(accessToken);
            setTrialNetworks(response["tn_ids"]);
        } catch (error) {
            console.error('Error fetching trial networks:', error.message);
        }
    }

    useEffect(() => {
        fetchTrialNetworks();
    }, []);

    return (
        <div>
            <h1>List of Trial Networks</h1>
            <ul>
                {trialNetworks.map((tnId, index) => (
                    <li key={index}>{tnId}</li>
                ))}
            </ul>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};