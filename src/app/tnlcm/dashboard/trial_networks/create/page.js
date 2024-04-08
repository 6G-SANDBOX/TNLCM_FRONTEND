"use client"

import { useState, useEffect } from "react";
import Input from "@/components/elements/Input";
import Button from "@/components/elements/Button";
import { getExtractInfoComponents6GLibrary, getTrialNetworksTemplates } from "@/lib/apiHandler";
import { getAccessTokenFromLocalStorage } from "@/lib/jwtHandler";
import CreateEntity from "@/components/elements/CreateEntity";
import CustomSelect from "@/components/elements/CustomSelect";

export default function CreateTrialNetworkPage() {
    const [branchOrCommit, setBranchOrCommit] = useState("branch");
    const [templateOrCustom, setTemplateOrCustom] = useState("template");
    const [trialNetworksTemplates, setTrialNetworksTemplates] = useState([]);
    const [commitId, setCommitId] = useState("");
    const [branch, setBranch] = useState("");
    const [components, setComponents] = useState({});

    const branchOrCommitOptions = [
        { label: "Branch", value: "branch" },
        { label: "Commit ID", value: "commit_id" }
    ];

    const templateOrCustomOption = [
        { label: "Template", value: "template" },
        { label: "Custom", value: "custom" }
    ];

    const handleExtractInfoComponents6GLibrary = async () => {
        const comp = await getExtractInfoComponents6GLibrary(branch, commitId);
        setComponents(comp);
    };

    const fetchTrialNetworksTemplates = async () => {
        try {
            const accessToken = await getAccessTokenFromLocalStorage();
            const response = await getTrialNetworksTemplates(accessToken);
            setTrialNetworksTemplates(response);
        } catch (error) {
            alert(error);
        }
    };

    useEffect(() => {
        fetchTrialNetworksTemplates();
    }, []);

    return (
        <div>
            <h1>Create Trial Network</h1>
            <h2>Select whether to create a customized trial network or use a template</h2>
            <CustomSelect
                value={templateOrCustom}
                onChange={(e) => setTemplateOrCustom(e.target.value)}
                options={templateOrCustomOption}
            />
            <br />
            {templateOrCustom == "custom" ? (
                <div>
                    <h2>6G-Library</h2>
                    <CustomSelect
                        value={branchOrCommit}
                        onChange={(e) => setBranchOrCommit(e.target.value)}
                        options={branchOrCommitOptions}
                    />
                    <br />
                    {branchOrCommit === "branch" ? (
                        <Input
                            type="text"
                            id="branch"
                            placeholder="Introduce the 6G-Library branch"
                            value={branch}
                            onChange={(e) => setBranch(e.target.value)}
                            className="input-login-register"
                            required={true}
                        />
                    ) : (
                        <Input
                            type="text"
                            id="commitId"
                            placeholder="Introduce the 6G-Library commit id"
                            value={commitId}
                            onChange={(e) => setCommitId(e.target.value)}
                            className="input-login-register"
                            required={true}
                        />
                    )}
                    <Button
                        type="submit"
                        className="button-login-register"
                        onClick={handleExtractInfoComponents6GLibrary}
                    >
                        Extract 6G-Library components
                    </Button>
                    {Object.keys(components).length > 0 && (
                        <div>
                            <h2>6G-Library Components:</h2>
                            <ul>
                                {Object.entries(components).map(([componentType, componentData]) => (
                                    <li key={componentType}>
                                        {componentType}
                                    </li>
                                ))}
                            </ul>
                            <CreateEntity components={components} selectedOption={branchOrCommit} branch={branch} commitId={commitId} />
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    {Object.keys(trialNetworksTemplates).length > 0 && (
                        <div>
                            <h2>Trial networks templates:</h2>
                            <ul>
                                {Object.entries(trialNetworksTemplates).map(([componentType, componentData]) => (
                                    <li key={componentType}>
                                        {componentType}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};