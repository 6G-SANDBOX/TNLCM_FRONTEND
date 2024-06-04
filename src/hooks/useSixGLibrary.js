import { getSitePartsComponents, getSixGLibraryBranches, getSiteComponents } from "@/lib/apiHandler";
import { useState } from "react";

export default function useSixGLibrary() {
    const [sixGLibrarybranches, setSixGLibrarybranches] = useState([]);
    const [components, setComponents] = useState([]);
    const [partsComponents, setPartsComponents] = useState({});

    const handleSixGLibraryBranches = async (e) => {
        try {
            const response = await getSixGLibraryBranches();
            setSixGLibrarybranches(response);
        } catch (error) {
            alert(error);
        }
    }

    const handlePartsComponents = async (githubSixGLibraryReference, githubSixGSandboxSitesReference, site) => {
        try {
            const response = await getSitePartsComponents(githubSixGLibraryReference, githubSixGSandboxSitesReference, site);
            setPartsComponents(response);
        } catch (error) {
            alert(error);
        }
    }

    const handleComponents = async (githubSixGLibraryReference, githubSixGSandboxSitesReference, site) => {
        try {
            const response = await getSiteComponents(githubSixGLibraryReference, githubSixGSandboxSitesReference, site);
            setComponents(response);
        } catch (error) {
            alert(error);
        }
    }

    return {
        sixGLibrarybranches,
        setSixGLibrarybranches,
        handleSixGLibraryBranches,
        partsComponents,
        setPartsComponents,
        handlePartsComponents,
        components,
        setComponents,
        handleComponents
    }
}