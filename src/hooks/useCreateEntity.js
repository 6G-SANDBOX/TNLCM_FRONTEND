import { useState } from "react";

export default function useCreateEntity(partsComponents) {
    const [entity, setEntity] = useState("");
    const [componentType, setComponentType] = useState("");
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

    const handleAddEntityToDescriptor = (descriptor, setDescriptor) => {
        return (e) => {
            e.preventDefault();
            if (descriptor["trial_network"][entity]) {
                alert("An entity with the same name already exists in the descriptor");
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
                setEntity("");
                setComponentType("");
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
        inputPart,
        setInputPart,
        metadataPart,
        setMetadataPart,
        inputDescriptor,
        setInputDescriptor,
        handleComponentStructure,
        handleInputDescriptorChange,
        handleAddEntityToDescriptor
    }
}