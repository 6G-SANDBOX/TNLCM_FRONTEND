import { useState } from "react";

export default function useCreateEntity(components) {
    const [entity, setEntity] = useState("");
    const [componentType, setComponentType] = useState("");
    const [inputPart, setInputPart] = useState({});
    const [inputDescriptor, setInputDescriptor] = useState({});

    const handleComponentStructure = (value) => {
        setComponentType(value);
        setInputPart(components[value]["input"]);
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
        inputDescriptor,
        setInputDescriptor,
        handleComponentStructure,
        handleInputDescriptorChange,
        handleAddEntityToDescriptor
    }
}