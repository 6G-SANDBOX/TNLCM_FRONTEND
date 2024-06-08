import { useState } from "react";
import { getSites } from "@/lib/apiHandler";
import { getAccessTokenFromLocalStorage } from "@/lib/jwtHandler";

export default function useSixGSandboxSites() {
    const [githubSixGSandboxSitesReferenceType, setGithubSixGSandboxSitesReferenceType] = useState("");
    const [githubSixGSandboxSitesReferenceValue, setGithubSixGSandboxSitesReferenceValue] = useState("");
    const [deploymentSite, setDeploymentSite] = useState([]);
    const [sites, setSites] = useState([]);

    const handleSites = async (e) => {
        e.preventDefault();
        try {
            const token = await getAccessTokenFromLocalStorage();
            const response = await getSites(token, githubSixGSandboxSitesReferenceType, githubSixGSandboxSitesReferenceValue);
            setSites(response);
        } catch (error) {
            alert(error);
        }
    }

    return {
        githubSixGSandboxSitesReferenceType,
        setGithubSixGSandboxSitesReferenceType,
        githubSixGSandboxSitesReferenceValue,
        setGithubSixGSandboxSitesReferenceValue,
        deploymentSite,
        setDeploymentSite,
        sites,
        setSites,
        handleSites
    }
}