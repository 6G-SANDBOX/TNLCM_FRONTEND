import { useState } from "react";
import { trialNetworkDeployment } from "@/lib/apiHandler";
import { getAccessTokenFromLocalStorage } from "@/lib/jwtHandler";

export default function useDeployTrialNetwork() {
    const [trialNetworkDeployed, setTrialNetworkDeployed] = useState(false);

    const handleDeployTrialNetwork = async (tnId, branchOrCommit, branch, commitId) => {
        try {
            const token = await getAccessTokenFromLocalStorage();
            await trialNetworkDeployment(token, tnId, branchOrCommit, branch, commitId);
            setTrialNetworkDeployed(true);
        } catch (error) {
            alert(error);
        }
    };

    return {
        trialNetworkDeployed,
        setTrialNetworkDeployed,
        handleDeployTrialNetwork
    }
}