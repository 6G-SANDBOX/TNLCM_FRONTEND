"use client"

import { useState } from "react";
import CustomSelect from "@/components/elements/CustomSelect";
import CustomForm from "@/components/elements/CustomForm";
import useExtractInfoComponents6GLirabry from "@/hooks/useExtractInfoComponents6GLirabry";
import useCreateEntity from "@/hooks/useCreateEntity";
import useCreateDescriptor from "@/hooks/useCreateDescriptor";

export default function CreateTrialNetworkPage() {

    const [branchOrCommit, setBranchOrCommit] = useState("branch");

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
        handleComponentStructure,
        handleDependsPartChange
    } = useCreateEntity(components);

    const {
        descriptor,
        setDescriptor
    } = useCreateDescriptor();

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
        const inputsDependenciesComponents = dependsPart.map((dependency, index) => ({
            type: "text",
            placeholder: `List ${dependency}`,
            onChange: (e) => handleDependsPartChange(e.target.value, index),
            className: "input-login-register-verification",
            required: true
        }));
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

    return (
        <div>
            <h1>Create trial network</h1>
            <h2>6G-Library</h2>
            <CustomSelect
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
            />
            {Object.keys(components).length > 0 && (
                <div>
                    {renderComponents()}
                    {renderCreateEntities()}
                    {renderTypeOfComponents()}
                    {componentType && renderDependsComponent()}
                </div>
            )}
        </div>
    );
};