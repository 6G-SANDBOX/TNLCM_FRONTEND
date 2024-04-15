import { useState } from "react";

export default function useCreateEntity(components) {
    const [entity, setEntity] = useState("");
    const [componentType, setComponentType] = useState("");
    const [publicPart, setPublicPart] = useState({});
    const [dependsPart, setDependsPart] = useState([]);
    const [publicDescriptor, setPublicDescriptor] = useState({});
    const [dependsDescriptor, setDependsDescriptor] = useState([]);

    const handleComponentStructure = (value) => {
        setComponentType(value);
        setPublicPart(components[value]["public"]);
        setDependsPart(components[value]["depends"]);
    }

    const handleDependsDescriptorChange = (value, index) => {
        setDependsDescriptor(prevState => {
            const newDependsDescriptor = [...prevState];
            newDependsDescriptor[index] = value;
            return newDependsDescriptor;
        });
    }

    const handlePublicDescriptorChange = (value, key) => {
        setPublicDescriptor(prevState => ({
            ...prevState,
            [key]: value
        }));
    }

    const handleAddEntityToDescriptor = (descriptor, setDescriptor) => {
        return (e) => {
            e.preventDefault();
            if (descriptor["trial_network"][entity]) {
                alert("An entity with the same name already exists in the descriptor.");
            } else {
                setDescriptor(prevDescriptor => ({
                    ...prevDescriptor,
                    trial_network: {
                        ...prevDescriptor.trial_network,
                        [entity]: {
                            type: componentType,
                            depends_on: dependsDescriptor,
                            public: publicDescriptor
                        }
                    }
                }));
                setEntity("");
                setComponentType("");
                setPublicPart({});
                setDependsPart([]);
                setPublicDescriptor({});
                setDependsDescriptor([]);
            }
        }
    }

    return {
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
    }
}