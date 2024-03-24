'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../../components/Button';
import { getTrialNetworks } from '../../lib/apiHandler';
import { getAccessTokenFromLocalStorage } from '../../lib/jwtHandler';

export default function HomePage() {
    const [trialNetworks, setTrialNetworks] = useState([]);
    const router = useRouter();
    
    const handleLogout = () => {
        router.push('/tnlcm/logout');
    };

    async function fetchTrialNetworks() {
        try {
            const accessToken = getAccessTokenFromLocalStorage();
            const response = await getTrialNetworks(accessToken);
            setTrialNetworks(response["tn_ids"]);
        } catch (error) {
            alert(error);
        }
    };

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
            <Button onClick={handleLogout} className="button-login-register">Logout</Button>
        </div>
    );
};