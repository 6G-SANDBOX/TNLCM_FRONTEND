import { useState } from "react";
import { getTrialNetworksStatus } from "@/lib/apiHandler";
import { getAccessTokenFromLocalStorage } from "@/lib/jwtHandler";

export default function useTrialNetworksStatus() {
    const [trialNetworks, setTrialNetworks] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleTrialNetworksStatus = async (e) => {
        try {
            const accessToken = await getAccessTokenFromLocalStorage();
            const response = await getTrialNetworksStatus(accessToken);
            setTrialNetworks(response);
        } catch (error) {
            alert(error);
        } finally {
            setLoading(false);
        }
    }

    return {
        trialNetworks,
        loading,
        handleTrialNetworksStatus
    }
}