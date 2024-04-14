import { useState } from "react";

export default function useCreateEntity(components) {
    const [entity, setEntity] = useState("");
    const [componentType, setComponentType] = useState("");
    const [publicPart, setPublicPart] = useState({});
    const [dependsPart, setDependsPart] = useState([]);

    const handleComponentStructure = (value) => {
        setComponentType(value);
        setPublicPart(components[value]["public"]);
        setDependsPart(components[value]["depends"]);
    }

    const handleDependsPartChange = (value, index) => {
        const newDependsPart = [...dependsPart];
        newDependsPart[index] = value;
        setDependsPart(newDependsPart);
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
        handleComponentStructure,
        handleDependsPartChange
    }
}