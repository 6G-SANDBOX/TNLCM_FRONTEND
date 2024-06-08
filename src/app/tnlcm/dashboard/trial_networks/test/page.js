"use client"

import { useEffect, useState } from "react";
import CustomInput from "@/components/elements/CustomInput";
import CustomButton from "@/components/elements/CustomButton";
import CustomSelect from "@/components/elements/CustomSelect";
import CustomLoader from "@/components/elements/CustomLoader";
import useCreateTrialNetwork from "@/hooks/useCreateTrialNetwork";
import useSixGLibrary from "@/hooks/useSixGLibrary";
import useSixGSandboxSites from "@/hooks/useSixGSandboxSites";
import useTrialNetworkStateMachine from "@/hooks/useTrialNetworkStateMachine";

export default function TestPage() {

    const gitOptions = ["branch", "commit", "tag"];
    const [descriptor, setDescriptor] = useState(null);

    const {
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
    } = useSixGLibrary();

    const {
        githubSixGSandboxSitesReferenceType,
        setGithubSixGSandboxSitesReferenceType,
        githubSixGSandboxSitesReferenceValue,
        setGithubSixGSandboxSitesReferenceValue,
        deploymentSite,
        setDeploymentSite,
        sites,
        setSites,
        handleSites
    } = useSixGSandboxSites();

    const {
        tnId,
        setTnId,
        trialNetworkCreated,
        setTrialNetworkCreated,
        handleCreateTrialNetwork
    } = useCreateTrialNetwork();

    const {
        trialNetworkState,
        setTrialNetworkState,
        loadingStateMachine,
        setLoadingStateMachine,
        handleTrialNetworkStateMachine
    } = useTrialNetworkStateMachine();

    useEffect(() => {
        setGithubSixGLibraryReferenceType(gitOptions[0]);
        setGithubSixGSandboxSitesReferenceType(gitOptions[0]);
    }, []);

    const renderSixGLibraryReferenceType = () => {
        return (
            <div>
                <h2>6G-Library. Select reference type: </h2>
                <CustomSelect options={gitOptions} value={githubSixGLibraryReferenceType} onChange={(e) => setGithubSixGLibraryReferenceType(e.target.value)} />
                <CustomInput
                    type="text"
                    title="Enter reference value: "
                    onChange={(e) => setGithubSixGLibraryReferenceValue(e.target.value)}
                    className="input-login-register-verification"
                    required={true}
                />
            </div>
        )
    }

    const renderSixGSandboxSitesReferenceType = () => {
        return (
            <div>
                <h2>6G-Sandbox-Sites. Select reference type:</h2>
                <CustomSelect options={gitOptions} value={githubSixGSandboxSitesReferenceType} onChange={(e) => setGithubSixGSandboxSitesReferenceType(e.target.value)} />
                <CustomInput
                    type="text"
                    title="Enter reference value: "
                    onChange={(e) => setGithubSixGSandboxSitesReferenceValue(e.target.value)}
                    className="input-login-register-verification"
                    required={true}
                /> 
            </div>
        )
    }

    const setGitConfiguration = () => {
        return (
            <CustomButton
                type="submit"
                className="button-login-register-verification"
                children="Set git configuration"
                onClick={(e) => handleSites(e)}
            />
        )
    }

    useEffect(() => {
        setDeploymentSite(sites[0]);
    }, [sites]);

    const renderDeploymentSite = () => {
        return (
            <div>
                <h2>Site to deploy trial network: </h2>
                <CustomSelect
                    value={deploymentSite}
                    onChange={(e) => setDeploymentSite(e.target.value)}
                    options={sites}
                />
            </div>
        );
    };

    const handleDescriptor = (file) => {
        let formData = new FormData();
        const blob = new Blob([file[0]], { type: "text/yaml" });
        formData.append("descriptor", blob, "descriptor.yaml");
        setDescriptor(formData);
    }

    const renderInputsTrialNetwork = () => {
        return (
            <div>
                <CustomInput
                    type="text"
                    title="(Optional) Enter a trial network identifier: "
                    onChange={(e) => setTnId(e.target.value)}
                    className="input-login-register-verification"
                    required={false}
                />
                <CustomInput
                    type="file"
                    title="Descriptor file: "
                    onChange={(e) => handleDescriptor(e.target.files)}
                    required={true}
                />
            </div>
        )
    }

    const renderCreateTrialNetwork = () => {
        return (
            <div>
                <CustomButton
                    type="submit"
                    className="button-login-register-verification"
                    children="Create trial network"
                    onClick={() => handleCreateTrialNetwork(tnId, deploymentSite, githubSixGLibraryReferenceType, githubSixGLibraryReferenceValue, githubSixGSandboxSitesReferenceType, githubSixGSandboxSitesReferenceValue, descriptor)}
                />
                {trialNetworkCreated && (
                    <h5>Trial network created with identifier: {tnId}</h5>
                )}
            </div>
        )
    }

    const renderTrialNetworkStateMachine = () => {
        return (
            <div>
                <CustomButton
                    type="submit"
                    className="button-login-register-verification"
                    children="Trial network state machine"
                    onClick={() => handleTrialNetworkStateMachine(tnId)}
                />
                {trialNetworkState && (
                    <h5>Trial network successfully deployed</h5>
                )}
            </div>
        )
    }

    return (
        <>
            {loadingStateMachine ? (
                <CustomLoader />
            ) : (
                <div>
                    <h1>Test page</h1>
                    <p>Page to test trial network descriptors</p>
                    {renderSixGLibraryReferenceType()}
                    {renderSixGSandboxSitesReferenceType()}
                    {setGitConfiguration()}
                    {sites.length > 0 && (
                        <>
                            {renderDeploymentSite()}
                            {renderInputsTrialNetwork()}
                            {descriptor !== null && renderCreateTrialNetwork()}
                            {trialNetworkCreated && renderTrialNetworkStateMachine()}
                            {trialNetworkState && (
                                <>
                                    {setTnId("")}
                                    {setDescriptor(null)}
                                </>
                            )}
                        </>
                    )}
                </div>
            )}
        </>
    )
}