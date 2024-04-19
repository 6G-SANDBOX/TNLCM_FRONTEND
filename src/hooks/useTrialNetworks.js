import { useState } from "react";
import { getTrialNetworks } from "@/lib/apiHandler";
import { getAccessTokenFromLocalStorage } from "@/lib/jwtHandler";

export default function useTrialNetworks() {
    const [trialNetworks, setTrialNetworks] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleTrialNetworks = async (e) => {
        try {
            const accessToken = await getAccessTokenFromLocalStorage();
            const response = await getTrialNetworks(accessToken);
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
        handleTrialNetworks
    }
}