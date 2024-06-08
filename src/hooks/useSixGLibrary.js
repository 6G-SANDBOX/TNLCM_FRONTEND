import { getSitePartsComponents, getSiteComponents } from "@/lib/apiHandler";
import { useState } from "react";

export default function useSixGLibrary() {
    const [githubSixGLibraryReferenceType, setGithubSixGLibraryReferenceType] = useState("");
    const [githubSixGLibraryReferenceValue, setGithubSixGLibraryReferenceValue] = useState("");
    const [components, setComponents] = useState([]);
    const [partsComponents, setPartsComponents] = useState({});

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
        githubSixGLibraryReferenceType,
        setGithubSixGLibraryReferenceType,
        githubSixGLibraryReferenceValue,
        setGithubSixGLibraryReferenceValue,
        partsComponents,
        setPartsComponents,
        handlePartsComponents,
        components,
        setComponents,
        handleComponents
    }
}