import { getSites, getSixGSandboxSitesBranches } from "@/lib/apiHandler";
import { useState } from "react";

export default function useSixGSandboxSites() {
    const [sixGSandboxSitesbranches, setSixGSandboxSitesbranches] = useState([]);
    const [sites, setSites] = useState([]);

    const handleSixGSandboxSitesBranches = async (e) => {
        try {
            const response = await getSixGSandboxSitesBranches();
            setSixGSandboxSitesbranches(response);
            handleSites();
        } catch (error) {
            alert(error);
        }
    }

    const handleSites = async (e) => {
        try {
            const response = await getSites(sixGSandboxSitesbranches);
            setSites(response);
        } catch (error) {
            alert(error);
        }
    }

    return {
        sixGSandboxSitesbranches,
        setSixGSandboxSitesbranches,
        handleSixGSandboxSitesBranches,
        sites,
        setSites,
        handleSites
    }
}