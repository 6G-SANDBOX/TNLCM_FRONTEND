import { useState } from "react";
import { trialNetworkStateMachine } from "@/lib/apiHandler";
import { getAccessTokenFromLocalStorage } from "@/lib/jwtHandler";

export default function useTrialNetworkStateMachine() {
    const [trialNetworkState, setTrialNetworkState] = useState(false);

    const handleTrialNetworkStateMachine = async (tnId, jobName) => {
        try {
            const token = await getAccessTokenFromLocalStorage();
            await trialNetworkStateMachine(token, tnId, jobName);
            setTrialNetworkState(true);
        } catch (error) {
            alert(error);
        }
    };

    return {
        trialNetworkState,
        setTrialNetworkState,
        handleTrialNetworkStateMachine
    }
}