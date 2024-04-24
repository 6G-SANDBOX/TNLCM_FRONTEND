"use client"

import yaml from "js-yaml";
import { useEffect, useState } from "react";
import useTrialNetworksTemplates from "@/hooks/useTrialNetworksTemplates";

export default function TemplatesPage() {

    const [renderedOnce, setRenderedOnce] = useState(false);

    const {
        trialNetworksTemplates,
        loading,
        handleTrialNetworksTemplates
    } = useTrialNetworksTemplates();

    useEffect(() => {
        if (!renderedOnce) {
            handleTrialNetworksTemplates();
            setRenderedOnce(true);
        }
    }, [renderedOnce, handleTrialNetworksTemplates]);

    return (
        <ul>
            {trialNetworksTemplates && trialNetworksTemplates.map((templates) => (
                <li key={templates["tn_id"]}>
                    <h2>{templates["tn_id"]}</h2>
                    <pre>{yaml.dump(templates["tn_sorted_descriptor"])}</pre>
                </li>
            ))}
        </ul>
    );
}