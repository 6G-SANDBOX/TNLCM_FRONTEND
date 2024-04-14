"use client"

import { useEffect } from "react";
import CustomTable from "@/components/elements/CustomTable";
import Loader from "@/components/elements/CustomLoader";
import useTrialNetworksStatus from "@/hooks/useTrialNetworksStatus";

export default function TrialNetworksStatusPage() {

    const {
        trialNetworks,
        loading,
        handleTrialNetworksStatus
    } = useTrialNetworksStatus();

    useEffect(() => {
        handleTrialNetworksStatus();
    }, []);

    const renamedTrialNetworks = trialNetworks.map(network => ({
        tn_id: network.tn_id,
        status: network.tn_status,
        date_created: network.tn_date_created
    }));

    return (
        <div>
            <h1>Information about trial networks</h1>
            {loading ? (
                <Loader />
            ) : (
                trialNetworks.length > 0 && (
                    <CustomTable
                        columns={["tn_id", "status", "date_created"]}
                        data={renamedTrialNetworks}
                    />
                )
            )}
        </div>
    );
};