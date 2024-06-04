import { useState } from "react";

export default function useCreateEntity(partsComponents) {
    const [entity, setEntity] = useState("");
    const [componentType, setComponentType] = useState("");
    const [dependencies, setDependencies] = useState([]);
    const [inputPart, setInputPart] = useState({});
    const [metadataPart, setMetadataPart] = useState({});
    const [inputDescriptor, setInputDescriptor] = useState({});

    const handleComponentStructure = (value) => {
        setComponentType(value);
        setInputPart(partsComponents[value]["input"]);
        setMetadataPart(partsComponents[value]["metadata"]);
    }

    const handleInputDescriptorChange = (value, key) => {
        setInputDescriptor(prevState => ({
            ...prevState,
            [key]: value
        }));
    }

    const handleInputDependenciesDescriptorChange = (value, key) => {
        setInputDescriptor(prevState => ({
            ...prevState,
            [key]: value
        }));
        setDependencies(prevState => ([
            ...prevState,
            value
        ]));
    }

    const handleAddEntityToDescriptor = (descriptor, setDescriptor) => {
        return (e) => {
            e.preventDefault();
            if (descriptor["trial_network"][entity]) {
                alert("An entity with the same name already exists in the descriptor");
            } else {
                if (componentType !== "tn_bastion" && componentType !== "tn_vxlan" && componentType !== "tn_init") {
                    setDescriptor(prevDescriptor => ({
                        ...prevDescriptor,
                        trial_network: {
                            ...prevDescriptor.trial_network,
                            [entity]: {
                                type: componentType,
                                name: entity.split("-").pop(),
                                input: inputDescriptor
                            }
                        }
                    }));
                } else {
                    setDescriptor(prevDescriptor => ({
                        ...prevDescriptor,
                        trial_network: {
                            ...prevDescriptor.trial_network,
                            [entity]: {
                                type: componentType,
                                input: inputDescriptor
                            }
                        }
                    }));
                }
                if (dependencies.length > 0) {
                    setDescriptor(prevDescriptor => ({
                        ...prevDescriptor,
                        trial_network: {
                            ...prevDescriptor.trial_network,
                            [entity]: {
                                dependencies: dependencies,
                            }
                        }
                    }));
                }
                setEntity("");
                setComponentType("");
                setDependencies([]);
                setInputPart({});
                setMetadataPart({});
                setInputDescriptor({});
            }
        }
    }

    return {
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
        handleInputDependenciesDescriptorChange,
        handleAddEntityToDescriptor
    }
}