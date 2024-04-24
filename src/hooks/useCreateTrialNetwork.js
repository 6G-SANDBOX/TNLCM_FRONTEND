import { useState } from "react";
import { createTrialNetwork } from "@/lib/apiHandler";
import { getAccessTokenFromLocalStorage } from "@/lib/jwtHandler";

export default function useCreateTrialNetwork() {
    const [tnId, setTnId] = useState("");
    const [trialNetworkCreated, setTrialNetworkCreated] = useState(false);

    const handleCreateTrialNetwork = async (descriptorAsYaml) => {
        try {
            const token = await getAccessTokenFromLocalStorage();
            const id = await createTrialNetwork(token, descriptorAsYaml);
            setTnId(id);
            setTrialNetworkCreated(true);
        } catch (error) {
            alert(error);
        }
    };

    return {
        tnId,
        setTnId,
        trialNetworkCreated,
        setTrialNetworkCreated,
        handleCreateTrialNetwork
    }
}