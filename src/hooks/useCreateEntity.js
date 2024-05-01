import { useState } from "react";

export default function useCreateEntity(components) {
    const [entity, setEntity] = useState("");
    const [componentType, setComponentType] = useState("");
    const [inputPart, setInputPart] = useState({});
    const [needsPart, setNeedsPart] = useState([]);
    const [inputDescriptor, setInputDescriptor] = useState({});
    const [needsDescriptor, setNeedsDescriptor] = useState([]);

    const handleComponentStructure = (value) => {
        setComponentType(value);
        setInputPart(components[value]["input"]);
        setNeedsPart(components[value]["metadata"]["needs"]);
    }

    const handleNeedsDescriptorChange = (value, index) => {
        setNeedsDescriptor(prevState => {
            const newNeedsDescriptor = [...prevState];
            newNeedsDescriptor[index] = value;
            return newNeedsDescriptor;
        });
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
                            needs: needsDescriptor,
                            input: inputDescriptor
                        }
                    }
                }));
                setEntity("");
                setComponentType("");
                setInputPart({});
                setNeedsPart([]);
                setInputDescriptor({});
                setNeedsDescriptor([]);
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
        needsPart,
        setNeedsPart,
        inputDescriptor,
        setInputDescriptor,
        needsDescriptor,
        setNeedsDescriptor,
        handleComponentStructure,
        handleNeedsDescriptorChange,
        handleInputDescriptorChange,
        handleAddEntityToDescriptor
    }
}