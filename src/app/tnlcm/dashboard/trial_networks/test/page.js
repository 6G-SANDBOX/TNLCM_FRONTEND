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

    const [githubSixGLibraryReference, setGithubSixGLibraryReference] = useState("");
    const [githubSixGSandboxSitesReference, setGithubSixGSandboxSitesReference] = useState("");
    const [deploymentSite, setDeploymentSite] = useState("");
    const [descriptor, setDescriptor] = useState(null);
    const [renderedOnce, setRenderedOnce] = useState(false);

    const {
        sixGLibrarybranches,
        setSixGLibrarybranches,
        handleSixGLibraryBranches,
        partsComponents,
        setPartsComponents,
        handlePartsComponents
    } = useSixGLibrary();

    const {
        sixGSandboxSitesbranches,
        setSixGSandboxSitesbranches,
        handleSixGSandboxSitesBranches,
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
        if (!renderedOnce) {
            handleSixGLibraryBranches();
            handleSixGSandboxSitesBranches();
            setRenderedOnce(true);
        }
    }, [renderedOnce, handleSixGSandboxSitesBranches]);

    const selectReferenceSixGLibrary = () => {
        const defaultOption = "Select branch";
        const updateSixGLibrarybranches = [defaultOption, ...sixGLibrarybranches];
        return (
            <div>
                <h2>6G-Library branch. Main branch will be used by default: </h2>
                <CustomSelect
                    value={githubSixGLibraryReference}
                    onChange={(e) => setGithubSixGLibraryReference(e.target.value)}
                    options={updateSixGLibrarybranches}
                />
            </div>
        );
    };

    const selectReferenceSixGSandboxSites = () => {
        const defaultOption = "Select branch";
        const updateSixGSandboxSitesbranches = [defaultOption, ...sixGSandboxSitesbranches];
        return (
            <div>
                <h2>6G-Sandbox-Sites branch. Main branch will be used by default: </h2>
                <CustomSelect
                    value={githubSixGSandboxSitesReference}
                    onChange={(e) => setGithubSixGSandboxSitesReference(e.target.value)}
                    options={updateSixGSandboxSitesbranches}
                />
            </div>
        );
    };

    const selectDeploymentSite = () => {
        const defaultOption = "Select site";
        const updateSites = [defaultOption, ...sites];
        return (
            <div>
                <h2>Site to deploy trial network: </h2>
                <CustomSelect
                    value={deploymentSite}
                    onChange={(e) => setDeploymentSite(e.target.value)}
                    options={updateSites}
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
                    required="false"
                />
                <CustomInput
                    type="file"
                    title="Descriptor file: "
                    onChange={(e) => handleDescriptor(e.target.files)}
                    required="true"
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
                    onClick={() => handleCreateTrialNetwork(tnId, deploymentSite, githubSixGLibraryReference, githubSixGSandboxSitesReference, descriptor)}
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
                    {sixGLibrarybranches.length > 0 && selectReferenceSixGLibrary()}
                    {githubSixGLibraryReference !== "" && selectReferenceSixGSandboxSites()}
                    {githubSixGSandboxSitesReference !== "" && selectDeploymentSite()}
                    {deploymentSite !== "" && renderInputsTrialNetwork()}
                    {descriptor !== null && renderCreateTrialNetwork()}
                    {trialNetworkCreated && renderTrialNetworkStateMachine()}
                    {trialNetworkState && (
                        <>
                            {setTnId("")}
                            {setDescriptor(null)}
                        </>
                    )}
                </div>
            )}
        </>
    )
}