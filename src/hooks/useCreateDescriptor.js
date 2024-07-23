import { useState } from "react";
import yaml from "js-yaml";

export default function useCreateDescriptor() {

    const initDescriptor = {
        "tn_init": {
            "type": "tn_init",
            "depends_on": [],
            "public": {}
        }
    };

    const [descriptor, setDescriptor] = useState({"trial_network": initDescriptor});
    const descriptorAsYaml = yaml.dump(descriptor);

    const handleDeleteEntity = (entityName) => {
        const updatedDescriptor = { ...descriptor };
        delete updatedDescriptor.trial_network[entityName];
        setDescriptor(updatedDescriptor);
    }

    return {
        descriptorAsYaml,
        descriptor,
        setDescriptor,
        handleDeleteEntity
    }
}