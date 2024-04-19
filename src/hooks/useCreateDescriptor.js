import { useState } from "react";
import yaml from "js-yaml";
export default function useCreateDescriptor() {

    const initDescriptor = {
        "mandatory_tn_vxlan": {
            "type": "tn_vxlan",
            "depends_on": [],
            "public": {
                "one_vxlan_name": "mandatory_tn_vxlan"
            }
        },
        "mandatory_tn_bastion": {
            "type": "tn_bastion",
            "depends_on": ["mandatory_tn_vxlan"],
            "public": {
                "one_component_networks": ["mandatory_tn_vxlan"]
            }
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