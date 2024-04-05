"use client"

import { useState, useEffect } from "react";
import { getStatusTrialNetworks } from "@/lib/apiHandler";
import { getAccessTokenFromLocalStorage } from "@/lib/jwtHandler";
import CustomTable from "@/components/elements/CustomTable";

export default function ListTrialNetworksPage() {
    const [trialNetworks, setTrialNetworks] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const fetchTrialNetworks = async () => {
        try {
            const accessToken = await getAccessTokenFromLocalStorage();
            const response = await getStatusTrialNetworks(accessToken);
            setTrialNetworks(response);
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
                trialNetworks.length > 0 && (
                    <CustomTable 
                        columns={["tn_id", "tn_status"]}
                        data={trialNetworks}
                    />
                )
            )}
        </div>
    );
};