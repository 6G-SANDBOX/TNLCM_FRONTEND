'use client'

import React, { useState } from 'react';
import Input from '@/app/components/Input';
import Button from '@/app/components/Button';
import { getComponents6GLibrary } from '@/app/lib/apiHandler';
import CreateEntity from '@/app/components/CreateComponent';

export default function CreateTrialNetworkPage() {
    const [tnId, setTnId] = useState('');
    const [selectedOption, setSelectedOption] = useState('branch');
    const [commitId, setCommitId] = useState('');
    const [branch, setBranch] = useState('');
    const [components, setComponents] = useState({});
    const [expandedComponents, setExpandedComponents] = useState(new Set());

    const handleTnIdChange = (event) => {
        setTnId(event.target.value);
    };

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleBranch = (event) => {
        setBranch(event.target.value);
    };

    const handleCommitId = (event) => {
        setCommitId(event.target.value);
    };

    const handleExtract6GLibraryComponents = async () => {
        const comp = await getComponents6GLibrary(branch, commitId);
        setComponents(comp);
    };

    return (
        <div>
            <h1>Create Trial Network</h1>
            <div>
                <a>Trial Network Identifier:</a>
                <Input
                    type="text"
                    id="tnId"
                    placeholder="Enter trial network identifier"
                    value={tnId}
                    onChange={handleTnIdChange}
                    className="input-login-register"
                    required={true}
                />
                <a>6G-Library</a>
                <br />
                <select value={selectedOption} onChange={handleOptionChange}>
                    <option value="branch">Branch</option>
                    <option value="commit_id">Commit ID</option>
                </select>
                <br />
                {selectedOption === 'branch' ? (
                    <Input
                        type="text"
                        id="branch"
                        placeholder="Introduce the 6G-Library branch"
                        value={branch}
                        onChange={handleBranch}
                        className="input-login-register"
                        required={true}
                    />
                ) : (
                    <Input
                        type="text"
                        id="commitId"
                        placeholder="Introduce the 6G-Library commit id"
                        value={commitId}
                        onChange={handleCommitId}
                        className="input-login-register"
                        required={true}
                    />
                )}
                <Button
                    type="submit"
                    className="button-login-register"
                    onClick={handleExtract6GLibraryComponents}
                >
                    Extract 6G-Library components
                </Button>
            </div>
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
                    <CreateEntity tnId={tnId} components={components} />
                </div>
            )}
        </div>
    );
};