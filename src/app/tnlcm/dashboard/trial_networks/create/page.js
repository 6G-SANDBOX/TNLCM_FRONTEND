"use client"

import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import CustomSelect from "@/components/elements/CustomSelect";
import CustomForm from "@/components/elements/CustomForm";
import CustomButton from "@/components/elements/CustomButton";
import useSixGLibrary from "@/hooks/useSixGLibrary";
import useSixGSandboxSites from "@/hooks/useSixGSandboxSites";
import useCreateEntity from "@/hooks/useCreateEntity";
import useCreateDescriptor from "@/hooks/useCreateDescriptor";
import useCreateTrialNetwork from "@/hooks/useCreateTrialNetwork";
import styles from "./CreateTrialNetwork.module.css";
import useTrialNetworkStateMachine from "@/hooks/useTrialNetworkStateMachine";

export default function CreateTrialNetworkPage() {

    const [githubSixGLibraryReference, setGithubSixGLibraryReference] = useState("");
    const [githubSixGSandboxSitesReference, setGithubSixGSandboxSitesReference] = useState("");
    const [deploymentSite, setDeploymentSite] = useState("");
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
        entity,
        setEntity,
        componentType,
        setComponentType,
        inputPart,
        setInputPart,
        inputDescriptor,
        setInputDescriptor,
        handleComponentStructure,
        handleInputDescriptorChange,
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
        if (!renderedOnce) {
            handleSixGLibraryBranches();
            handleSixGSandboxSitesBranches();
            setRenderedOnce(true);
        }
    }, [renderedOnce, handleSixGSandboxSitesBranches]);

    useEffect(() => {
        if (githubSixGLibraryReference !== "" && githubSixGSandboxSitesReference !== "" && deploymentSite !== "") {
            handlePartsComponents(githubSixGLibraryReference, githubSixGSandboxSitesReference, deploymentSite);
        }
    }, [githubSixGLibraryReference, githubSixGSandboxSitesReference, deploymentSite]);

    const selectReferenceSixGLibrary = () => {
        const defaultOption = "Select type";
        const updateSixGLibrarybranches = [defaultOption, ...sixGLibrarybranches];
        return (
            <div>
                <h2>6G-Library reference (branch, commit or tag): </h2>
                <CustomSelect
                    value={githubSixGLibraryReference}
                    onChange={(e) => setGithubSixGLibraryReference(e.target.value)}
                    options={updateSixGLibrarybranches}
                />
            </div>
        );
    };

    const selectReferenceSixGSandboxSites = () => {
        const defaultOption = "Select type";
        const updateSixGSandboxSitesbranches = [defaultOption, ...sixGSandboxSitesbranches];
        return (
            <div>
                <h2>6G-Sandbox-Sites reference (branch, commit or tag): </h2>
                <CustomSelect
                    value={githubSixGSandboxSitesReference}
                    onChange={(e) => setGithubSixGSandboxSitesReference(e.target.value)}
                    options={updateSixGSandboxSitesbranches}
                />
            </div>
        );
    };

    const selectDeploymentSite = () => {
        const defaultOption = "Select type";
        const updateSites = [defaultOption, ...sites];
        return (
            <div>
                <h2>Sites: </h2>
                <CustomSelect
                    value={deploymentSite}
                    onChange={(e) => setDeploymentSite(e.target.value)}
                    options={updateSites}
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

    const renderPublicComponent = () => {
        if (inputPart !== null) {
            const inputsPublicComponent = [];

            Object.entries(inputPart).forEach(([key, value]) => {
                const shouldRender = evaluateCondition(value.required_when);

                if (shouldRender) {
                    let inputElement;
                    if (value.choices) {
                        inputElement = {
                            title: `${key} - ${value.description}`,
                            type: 'select',
                            options: value.choices,
                            value: inputDescriptor[key] || value.default_value,
                            onChange: (e) => handleInputDescriptorChange(e.target.value, key),
                            className: "input-login-register-verification",
                            required: value.required_when
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

            const buttonsPublicComponent = [
                {
                    type: "submit",
                    className: "button-login-register-verification",
                    children: "Add entity to descriptor",
                    onClick: handleAddEntityToDescriptor(descriptor, setDescriptor)
                }
            ];

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
                );
            }
        }
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
            {sixGLibrarybranches.length > 0 && selectReferenceSixGLibrary()}
            {githubSixGLibraryReference !== "" && selectReferenceSixGSandboxSites()}
            {githubSixGSandboxSitesReference !== "" && selectDeploymentSite()}
            {deploymentSite !== "" && renderPartsComponents()}
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
        </div>
    );
};