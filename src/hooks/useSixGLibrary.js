import { getSitePartsComponents } from "@/lib/apiHandler";
import { useState } from "react";

export default function useSixGLibrary() {
    const [githubSixGLibraryReferenceType, setGithubSixGLibraryReferenceType] = useState("");
    const [githubSixGLibraryReferenceValue, setGithubSixGLibraryReferenceValue] = useState("");
    const [partsComponents, setPartsComponents] = useState({});

    const handlePartsComponents = async (site, githubSixGLibraryReferenceType, githubSixGLibraryReferenceValue, githubSixGSandboxSitesReferenceType, githubSixGSandboxSitesReferenceValue) => {
        try {
            const response = await getSitePartsComponents(site, githubSixGLibraryReferenceType, githubSixGLibraryReferenceValue, githubSixGSandboxSitesReferenceType, githubSixGSandboxSitesReferenceValue);
            setPartsComponents(response);
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
        handlePartsComponents
    }
}