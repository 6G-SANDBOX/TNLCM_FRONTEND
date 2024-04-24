import { useState } from "react";
import { getTrialNetworksTemplates } from "@/lib/apiHandler";
import { getAccessTokenFromLocalStorage } from "@/lib/jwtHandler";

export default function useTrialNetworksTemplates() {
    const [trialNetworksTemplates, setTrialNetworksTemplates] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleTrialNetworksTemplates = async (e) => {
        setLoading(true);
        try {
            const accessToken = await getAccessTokenFromLocalStorage();
            const response = await getTrialNetworksTemplates(accessToken);
            setTrialNetworksTemplates(response);
        } catch (error) {
            alert(error);
        } finally {
            setLoading(false);
        }
    }

    return {
        trialNetworksTemplates,
        loading,
        handleTrialNetworksTemplates
    }
}