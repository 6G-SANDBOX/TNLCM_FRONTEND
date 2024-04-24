import { useState } from "react";
import { getAccessTokenFromLocalStorage } from "@/lib/jwtHandler";
import { getTrialNetworkReport } from "@/lib/apiHandler";

export default function useTrialNetworkReport() {
    const [tnId, setTnId] = useState("");
    const [tnReport, setTnReport] = useState("");
    const [loading, setLoading] = useState(false);

    const handleTrialNetworkReport = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = await getAccessTokenFromLocalStorage();
            const tnReportMarkdown = await getTrialNetworkReport(token, tnId);
            setTnReport(tnReportMarkdown)
        } catch (error) {
            alert("Error al reportar la red de prueba: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyTrialNetworkReportPress = async (e) => {
        if (e.key === "Enter") {
            await handleTrialNetworkReport(e);
        }
    }

    return {
        tnId,
        setTnId,
        tnReport,
        loading,
        handleTrialNetworkReport,
        handleKeyTrialNetworkReportPress
    };
};