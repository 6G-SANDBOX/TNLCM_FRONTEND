"use client"

import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import CustomSelect from "@/components/elements/CustomSelect";
import CustomForm from "@/components/elements/CustomForm";
import CustomButton from "@/components/elements/CustomButton";
import useExtractInfoComponents6GLirabry from "@/hooks/useExtractInfoComponents6GLirabry";
import useCreateEntity from "@/hooks/useCreateEntity";
import useCreateDescriptor from "@/hooks/useCreateDescriptor";
import useCreateTrialNetwork from "@/hooks/useCreateTrialNetwork";
import useDeployTrialNetwork from "@/hooks/useDeployTrialNetwork";
import styles from "./CreateTrialNetwork.module.css";

export default function CreateTrialNetworkPage() {

    const [branchOrCommit, setBranchOrCommit] = useState("branch");
    const [renderedOnce, setRenderedOnce] = useState(false);

    const {
        branch,
        setBranch,
        commitId,
        setCommitId,
        components,
        loading,
        handleExtractInfoComponents6GLibrary,
        handleKeyExtractInfoComponents6GLibraryPress
    } = useExtractInfoComponents6GLirabry();

    const {
        entity,
        setEntity,
        componentType,
        setComponentType,
        publicPart,
        setPublicPart,
        dependsPart,
        setDependsPart,
        publicDescriptor,
        setPublicDescriptor,
        dependsDescriptor,
        setDependsDescriptor,
        handleComponentStructure,
        handleDependsDescriptorChange,
        handlePublicDescriptorChange,
        handleAddEntityToDescriptor
    } = useCreateEntity(components);

    const {
        descriptorAsYaml,
        descriptor,
        setDescriptor,
        handleDeleteEntity
    } = useCreateDescriptor();

    const {
        tnId,
        setTnId,
        trialNetworkCreated,
        setTrialNetworkCreated,
        handleCreateTrialNetwork
    } = useCreateTrialNetwork();

    const {
        trialNetworkDeployed,
        setTrialNetworkDeployed,
        handleDeployTrialNetwork
    } = useDeployTrialNetwork();

    useEffect(() => {
        if (!renderedOnce) {
            handleExtractInfoComponents6GLibrary();
            setBranchOrCommit("branch");
            setRenderedOnce(true);
        }
    }, [renderedOnce, handleExtractInfoComponents6GLibrary]);

    const branchOrCommitOptions = [
        { label: "Branch", value: "branch" },
        { label: "Commit ID", value: "commitId" }
    ];

    const inputs6glibrary = () => {
        if (branchOrCommit === "branch") {
            return [{
                type: "text",
                placeholder: "Introduce the 6G-Library branch",
                value: branch,
                onChange: (e) => setBranch(e.target.value),
                onKeyDown: handleKeyExtractInfoComponents6GLibraryPress,
                className: "input-login-register-verification",
                required: false
            }]
        } else if (branchOrCommit === "commitId") {
            return [{
                type: "text",
                placeholder: "Introduce the 6G-Library commit id",
                value: commitId,
                onChange: (e) => setCommitId(e.target.value),
                onKeyDown: handleKeyExtractInfoComponents6GLibraryPress,
                className: "input-login-register-verification",
                required: false
            }]
        } else {
            return [];
        }
    };

    const buttons6glibrary = [
        {
            type: "submit",
            className: "button-login-register-verification",
            disabled: loading,
            children: "Extract 6G-Library components",
            onClick: handleExtractInfoComponents6GLibrary
        }
    ];

    const renderComponents = () => {
        return (
            <ul>
                {Object.keys(components).map((componentType) => (
                    <li key={componentType}>
                        {componentType}
                    </li>
                ))}
            </ul>
        );
    }

    const renderCreateEntities = () => {
        const inputEntity = [
            {
                type: "text",
                placeholder: "Name of entity",
                value: entity,
                onChange: (e) => setEntity(e.target.value),
                className: "input-login-register-verification",
                required: true
            }
        ]

        return (
            <div>
                <h2>Add component</h2>
                <h3>Name of entity:</h3>
                <CustomForm
                    containerClassName=""
                    formClassName=""
                    h1=""
                    inputs={inputEntity}
                    buttons={[]}
                />
            </div>
        )
    }

    const renderTypeOfComponents = () => {
        const defaultOption = { label: "Select type", value: "" };
        const componentTypeOptions = [defaultOption, ...Object.keys(components).map(key => ({
            label: key,
            value: key
        }))];
        return (
            <div>
                <h3>Type of component:</h3>
                <CustomSelect
                    value={componentType}
                    onChange={(e) => handleComponentStructure(e.target.value)}
                    options={componentTypeOptions}
                />
            </div>
        )
    }

    const renderDependsComponent = () => {
        if (dependsPart !== null) {
            const inputsDependenciesComponents = dependsPart.flatMap((dependencies, index) =>
                Object.entries(dependencies).map(([key, value]) => ({
                    title: `${key} ${value["version"]}`,
                    type: "text",
                    placeholder: "",
                    onChange: (e) => handleDependsDescriptorChange(e.target.value, index),
                    className: "input-login-register-verification",
                    required: true
                }))
            );

            if (inputsDependenciesComponents.length > 0) {
                return (
                    <div>
                        <h4>Dependencies</h4>
                        <CustomForm
                            containerClassName=""
                            formClassName=""
                            h1=""
                            inputs={inputsDependenciesComponents}
                            buttons={[]}
                        />
                    </div>
                )
            }
        }
    }

    const renderPublicComponent = () => {
        if (publicPart !== null) {
            const inputsPublicComponent = [];
            Object.entries(publicPart).forEach(([key, value]) => {
                if (value["user_input"]) {
                    inputsPublicComponent.push({
                        title: `${key} - ${value["description"]}`,
                        type: value["type"],
                        placeholder: value["value"],
                        onChange: (e) => handlePublicDescriptorChange(e.target.value, key),
                        className: "input-login-register-verification",
                        required: value["optional"]
                    });
                }
                return inputsPublicComponent;
            })
            const buttonsPublicComponent = [
                {
                    type: "submit",
                    className: "button-login-register-verification",
                    children: "Add entity to descriptor",
                    onClick: handleAddEntityToDescriptor(descriptor, setDescriptor)
                }
            ]
            if (inputsPublicComponent.length > 0) {
                return (
                    <div>
                        <h4>Parameters</h4>
                        <CustomForm
                            containerClassName=""
                            formClassName=""
                            h1=""
                            inputs={inputsPublicComponent}
                            buttons={buttonsPublicComponent}
                        />
                    </div>
                )
            }
        }
    }

    const renderDescriptor = () => {
        return (
            <div>
                <div className={styles["descriptor-container"]}>
                    <h3>Descriptor</h3>
                    <pre>{descriptorAsYaml}</pre>
                </div>
                <h4>Delete components from the descriptor</h4>
                <ul>
                    {Object.keys(descriptor["trial_network"]).map((entityName, index) => (
                        <li key={index}>
                            <span>{entityName}</span>
                            {entityName !== "mandatory_tn_vxlan" && entityName !== "mandatory_tn_bastion" && (
                                <FaTrash onClick={() => handleDeleteEntity(entityName)} />
                            )}
                        </li>
                    ))}
                </ul>
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
                    onClick={() => handleCreateTrialNetwork(descriptorAsYaml)}
                />
                {trialNetworkCreated && (
                    <h5>Trial network created with identifier: {tnId}</h5>
                )}
            </div>
        )
    }

    const renderDeployTrialNetwork = () => {
        return (
            <div>
                <CustomButton
                    type="submit"
                    className="button-login-register-verification"
                    children="Deploy trial network"
                    onClick={() => handleDeployTrialNetwork(tnId, branchOrCommit, branch, commitId)}
                />
                {trialNetworkDeployed && (
                    <h5>Trial network successfully deployed</h5>
                )}
            </div>
        )
    }

    return (
        <div>
            <h1>Create trial network</h1>
            <h2>6G-Library components from {branch} {branchOrCommit}</h2>
            {/* <CustomSelect
                value={branchOrCommit}
                onChange={(e) => setBranchOrCommit(e.target.value)}
                options={branchOrCommitOptions}
            />
            <br />
            <CustomForm
                onSubmit={handleExtractInfoComponents6GLibrary}
                loading={loading}
                containerClassName=""
                formClassName=""
                h1=""
                inputs={inputs6glibrary()}
                buttons={buttons6glibrary}
            /> */}
            {Object.keys(components).length > 0 && (
                <div>
                    {renderComponents()}
                    {renderCreateEntities()}
                    {renderTypeOfComponents()}
                    {componentType && renderDependsComponent()}
                    {componentType && renderPublicComponent()}
                    {renderDescriptor()}
                    {descriptor && renderCreateTrialNetwork()}
                    {trialNetworkCreated && renderDeployTrialNetwork()}
                </div>
            )}
        </div>
    );
};