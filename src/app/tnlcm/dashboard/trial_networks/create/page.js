"use client"

import React, { useState } from "react";
import Input from "@/components/elements/Input";
import Button from "@/components/elements/Button";
import { getExtractInfoComponents6GLibrary } from "@/lib/apiHandler";
import CreateEntity from "@/components/elements/CreateEntity";
import CustomSelect from "@/components/elements/CustomSelect";

export default function CreateTrialNetworkPage() {
    const [selectedOption, setSelectedOption] = useState("branch");
    const [commitId, setCommitId] = useState("");
    const [branch, setBranch] = useState("");
    const [components, setComponents] = useState({});

    const potentialOptions = [
        { label: "Branch", value: "branch" },
        { label: "Commit ID", value: "commit_id" }
    ];

    const handleExtractInfoComponents6GLibrary = async () => {
        const comp = await getExtractInfoComponents6GLibrary(branch, commitId);
        setComponents(comp);
    };

    return (
        <div>
            <h1>Create Trial Network</h1>
            <a>6G-Library</a>
            <br />
            <CustomSelect
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
                options={potentialOptions}
            />
            <br />
            {selectedOption === "branch" ? (
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
                    <CreateEntity components={components} selectedOption={selectedOption} branch={branch} commitId={commitId} />
                </div>
            )}
        </div>
    );
};