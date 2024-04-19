"use client"

import { useEffect } from "react";
import CustomTable from "@/components/elements/CustomTable";
import Loader from "@/components/elements/CustomLoader";
import useTrialNetworks from "@/hooks/useTrialNetworks";

export default function TrialNetworksInformationPage() {

    const {
        trialNetworks,
        loading,
        handleTrialNetworks
    } = useTrialNetworks();

    useEffect(() => {
        handleTrialNetworks();
    }, []);

    const trialNetworksInformation = trialNetworks.map(trialNetwork => ({
        tn_id: trialNetwork.tn_id,
        status: trialNetwork.tn_status,
        date_created_utc: trialNetwork.tn_date_created_utc,
        tn_descriptor: trialNetwork.tn_sorted_descriptor
    }));

    return (
        <div>
            <h1>Information about trial networks</h1>
            {loading ? (
                <Loader />
            ) : (
                trialNetworks.length > 0 && (
                    <CustomTable
                        columns={["tn_id", "status", "date_created_utc", "tn_descriptor"]}
                        data={trialNetworksInformation}
                    />
                )
            )}
        </div>
    );
};