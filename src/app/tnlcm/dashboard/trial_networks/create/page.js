"use client"

import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import CustomSelect from "@/components/elements/CustomSelect";
import CustomInput from "@/components/elements/CustomInput";
import CustomForm from "@/components/elements/CustomForm";
import CustomButton from "@/components/elements/CustomButton";
import useSixGLibrary from "@/hooks/useSixGLibrary";
import useSixGSandboxSites from "@/hooks/useSixGSandboxSites";
import useCreateEntity from "@/hooks/useCreateEntity";
import useCreateDescriptor from "@/hooks/useCreateDescriptor";
import useCreateTrialNetwork from "@/hooks/useCreateTrialNetwork";
import useTrialNetworkStateMachine from "@/hooks/useTrialNetworkStateMachine";
import styles from "./CreateTrialNetwork.module.css";

export default function CreateTrialNetworkPage() {

    const gitOptions = ["branch", "commit", "tag"];

    const {
        githubSixGLibraryReferenceType,
        setGithubSixGLibraryReferenceType,
        githubSixGLibraryReferenceValue,
        setGithubSixGLibraryReferenceValue,
        partsComponents,
        setPartsComponents,
        handlePartsComponents
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
        entity,
        setEntity,
        componentType,
        setComponentType,
        dependencies,
        setDependencies,
        inputPart,
        setInputPart,
        metadataPart,
        setMetadataPart,
        inputDescriptor,
        setInputDescriptor,
        handleComponentStructure,
        handleInputDescriptorChange,
        handleInputDependencies,
        handleAddEntityToDescriptor
    } = useCreateEntity(partsComponents);

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
        trialNetworkState,
        setTrialNetworkState,
        handleTrialNetworkStateMachine
    } = useTrialNetworkStateMachine();

    useEffect(() => {
        setGithubSixGLibraryReferenceType(gitOptions[0]);
        setGithubSixGSandboxSitesReferenceType(gitOptions[0]);
    }, []);

    useEffect(() => {
        if (sites.length > 0) {
            setDeploymentSite(sites[0]);
        }
    }, [sites]);

    useEffect(() => {
        if (deploymentSite !== "") {
            handlePartsComponents(deploymentSite, githubSixGLibraryReferenceType, githubSixGLibraryReferenceValue, githubSixGSandboxSitesReferenceType, githubSixGSandboxSitesReferenceValue);
        }
    }, [deploymentSite]);

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

    const renderPartsComponents = () => {
        return (
            <div>
                <h2>
                    Components available on the {deploymentSite} site:
                </h2>
                <ul>
                    {Object.keys(partsComponents).map((componentType) => (
                        <li key={componentType}>
                            {componentType}
                        </li>
                    ))}
                </ul>
            </div>
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
                <h3>Name of entity. Format: component_type-custom_name:</h3>
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
        const defaultOption = "Select type";
        const componentTypeOptions = [defaultOption, ...Object.keys(partsComponents)];
        return (
            <div>
                <h3>Type of component:</h3>
                <CustomSelect
                    value={componentType}
                    onChange={(e) => handleComponentStructure(e.target.value)}
                    options={componentTypeOptions}
                />
                {componentType && <h4>{metadataPart.long_description}</h4>}
            </div>
        )
    }

    const evaluateCondition = (condition) => {
        if (!condition || typeof condition !== 'string') return true;
        if (condition.includes(' and ')) {
            const conditions = condition.split(' and ');
            return conditions.every(part => evaluatePart(part));
        } else if (condition.includes(' or ')) {
            const conditions = condition.split(' or ');
            return conditions.some(part => evaluatePart(part));
        }
        return evaluatePart(condition);
    };

    const evaluatePart = (part) => {
        const [left, operator, right] = part.split(' ');
        if (operator === '==') {
            return inputDescriptor[left] === right.replace(/['"]/g, '');
        } else if (operator === '!=') {
            return inputDescriptor[left] !== right.replace(/['"]/g, '');
        }
        return false;
    };

    useEffect(() => {
        if (inputPart) {
            const initialValues = {};
            Object.entries(inputPart).forEach(([key, value]) => {
                initialValues[key] = value.default_value || '';
            });
            setInputDescriptor(initialValues);
        }
    }, [inputPart]);

    const isComponentType = (type) => {
        return Object.values(partsComponents).includes(type);
    }

    const findSameTypesInDescriptor = (type) => {
        let sameTypeEntities = [];
        let trialNetwork = descriptor.trial_network;
        for (let entity in trialNetwork) {
            if (trialNetwork[entity].type === type) {
                sameTypeEntities.push(entity);
            }
        }
        return sameTypeEntities;
    }

    const renderPublicComponent = () => {
        let inputsPublicComponent = [];
        if (inputPart !== null) {
            Object.entries(inputPart).forEach(([key, value]) => {
                const isType = isComponentType(value.type);
                const shouldRender = evaluateCondition(value.required_when);
                if (shouldRender) {
                    let inputElement = {};
                    if (isType) {
                        const sameTypesName = findSameTypesInDescriptor(value.type);
                        inputElement = {
                            title: `${key} - ${value.description}`,
                            type: "select",
                            options: sameTypesName,
                            value: inputDescriptor[key],
                            onChange: (e) => handleInputDependencies(e.target.value, key),
                        };
                    } else if (value.choices) {
                        inputElement = {
                            title: `${key} - ${value.description}`,
                            type: "select",
                            options: value.choices,
                            value: inputDescriptor[key] || value.default_value,
                            onChange: (e) => handleInputDescriptorChange(e.target.value, key),
                        };
                    } else {
                        inputElement = {
                            title: `${key} - ${value.description}`,
                            type: value.type,
                            placeholder: value.default_value || "",
                            value: inputDescriptor[key] || "",
                            onChange: (e) => handleInputDescriptorChange(e.target.value, key),
                            className: "input-login-register-verification",
                            required: value.required_when
                        };
                    }
                    inputsPublicComponent.push(inputElement);
                }
            });
        }
        const buttonsPublicComponent = [
            {
                type: "submit",
                className: "button-login-register-verification",
                children: "Add entity to descriptor",
                onClick: handleAddEntityToDescriptor(descriptor, setDescriptor)
            }
        ];
        return (
            <div>
                {inputsPublicComponent.length > 0 && <h3>Parameters</h3>}
                {componentType &&
                    <CustomForm
                        containerClassName=""
                        formClassName=""
                        h1=""
                        inputs={inputsPublicComponent}
                        buttons={buttonsPublicComponent}
                    />
                }
            </div>
        );
    };

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
                            {entityName !== "tn_init" && (
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
                    onClick={() => handleCreateTrialNetwork(tnId, deploymentSite, githubSixGLibraryReference, githubSixGSandboxSitesReference, descriptorAsYaml)}
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
        <div>
            <h1>Create trial network</h1>
            {renderSixGLibraryReferenceType()}
            {renderSixGSandboxSitesReferenceType()}
            {setGitConfiguration()}
            {sites.length > 0 && (
                <>
                    {renderDeploymentSite()}
                    {renderPartsComponents()}
                    {Object.keys(partsComponents).length > 0 && (
                        <>
                            {renderCreateEntities()}
                            {renderTypeOfComponents()}
                            {renderPublicComponent()}
                            {renderDescriptor()}
                            {renderCreateTrialNetwork()}
                            {renderTrialNetworkStateMachine()}
                        </>
                    )}
                </>
            )}
        </div>
    );
};