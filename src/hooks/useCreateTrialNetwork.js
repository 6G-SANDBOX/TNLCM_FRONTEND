import { useState } from "react";
import { createTrialNetwork } from "@/lib/apiHandler";
import { getAccessTokenFromLocalStorage } from "@/lib/jwtHandler";

export default function useCreateTrialNetwork() {
    const [tnId, setTnId] = useState("");
    const [trialNetworkCreated, setTrialNetworkCreated] = useState(false);
    
    const handleCreateTrialNetwork = async (tnId, deploymentSite, githubSixGLibraryReferenceType, githubSixGLibraryReferenceValue, githubSixGSandboxSitesReferenceType, githubSixGSandboxSitesReferenceValue, descriptor) => {
        try {
            const token = await getAccessTokenFromLocalStorage();
            const id = await createTrialNetwork(token, tnId, deploymentSite, githubSixGLibraryReferenceType, githubSixGLibraryReferenceValue, githubSixGSandboxSitesReferenceType, githubSixGSandboxSitesReferenceValue, descriptor);
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