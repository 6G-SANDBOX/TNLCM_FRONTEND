'use client'

import { useState, useEffect } from 'react';
import { getTrialNetworks } from '../../../lib/apiHandler';
import { getAccessTokenFromLocalStorage } from '../../../lib/jwtHandler';

export default function TrialNetworksPage() {
    const [trialNetworks, setTrialNetworks] = useState([]);
    const [loading, setLoading] = useState(true);
    
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
        </div>
    );
};