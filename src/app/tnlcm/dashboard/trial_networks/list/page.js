"use client"

import { useState, useEffect } from "react";
import CustomTable from "@/components/elements/CustomTable";
import Loader from "@/components/elements/Loader";
import { getStatusTrialNetworks } from "@/lib/apiHandler";
import { getAccessTokenFromLocalStorage } from "@/lib/jwtHandler";

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
                <Loader />
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