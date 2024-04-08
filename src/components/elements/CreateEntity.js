"use client"

import { useState } from "react";
import yaml from "js-yaml";
import Input from "./Input";
import Button from "./Button";
import Descriptor from "./Descriptor";
import { getAccessTokenFromLocalStorage } from "@/lib/jwtHandler";
import { createTrialNetwork, deployTrialNetwork } from "@/lib/apiHandler";

export default function CreateEntity({ components, selectedOption, branch, commitId }) {

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
            "public": {}
        }
    };

    const [tnId, setTnId] = useState("");
    const [selectedComponent, setSelectedComponent] = useState("");
    const [entity, setEntity] = useState("");
    const [publicPart, setPublicPart] = useState({});
    const [dependsPart, setDependsPart] = useState([]);
    const [trialNetworkCreated, setTrialNetworkCreated] = useState(false);
    const [isDeploying, setIsDeploying] = useState(false);
    const [deployTrialNetworkCreated, setDeployTrialNetworkCreated] = useState(false);
    const [descriptor, setDescriptor] = useState({"trial_network": initDescriptor});

    const handleSetEntity = (event) => {
        const entityName = event.target.value;
        setEntity(entityName);
    };

    const handleComponentChange = (event) => {
        const selected = event.target.value;
        setSelectedComponent(event.target.value);
        const selectedComponentFields = components[selected];
        setPublicPart(selectedComponentFields["public"]);
        setDependsPart(selectedComponentFields["depends"]);
    };

    const handlePublicPartChange = (event, key) => {
        const newValue = event.target.value;
    
        const startsWithBracket = newValue.startsWith("[");
        const endsWithBracket = newValue.endsWith("]");

        if (startsWithBracket && endsWithBracket) {
            try {
                const parsedValue = JSON.parse(newValue);
                setPublicPart(prevState => ({
                    ...prevState,
                    [key]: parsedValue
                }));
            } catch (error) {
                setPublicPart(prevState => ({
                    ...prevState,
                    [key]: newValue
                }));
            }
        } else {
            setPublicPart(prevState => ({
                ...prevState,
                [key]: newValue
            }));
        }
    };    
    
    const handleDependsPartChange = (event, index) => {
        const newValue = event.target.value;
        setDependsPart(prevState => {
            const newState = [...prevState];
            newState[index] = newValue;
            return newState;
        });
    };    

    const handleAddToDescriptor = (componentType) => {
        const newEntity = {
            type: componentType,
            depends_on: [...dependsPart],
            public: { ...publicPart }
        };
    
        if (!descriptor["trial_network"].hasOwnProperty(entity)) {
            const newDescriptor = { ...descriptor };
            newDescriptor["trial_network"] = {
                ...newDescriptor["trial_network"],
                [entity]: newEntity
            };
            setDescriptor(newDescriptor);
        } else {
            alert("Entity exists");
        }
    };

    const handleRemoveFromDescriptor = (entityName) => {
        const newDescriptor = { ...descriptor };
        delete newDescriptor["trial_network"][entityName];
        setDescriptor(newDescriptor);
    };

    const handleCreateTrialNetwork = async () => {
        try {
            const descriptorYaml = yaml.dump(descriptor);
            const token = await getAccessTokenFromLocalStorage();
            const id = await createTrialNetwork(token, descriptorYaml);
            setTnId(id);
            setTrialNetworkCreated(true);
        } catch (error) {
            alert(error);
        }
    };

    const handleDeployTrialNetwork = async () => {
        try {
            setIsDeploying(true);
            const token = await getAccessTokenFromLocalStorage();
            await deployTrialNetwork(token, tnId, selectedOption, branch, commitId);
            setIsDeploying(false);
            setDeployTrialNetworkCreated(true);
        } catch (error) {
            alert(error);
        }
    }

    return (
        <div>
            <h2>Add component</h2>
            <h3>Name of entity:</h3>
            <Input 
                type="text"
                placeholder={"Name of entity"}
                onChange={(event) => handleSetEntity(event)}
                className="input-login-register"
            />
            <h3>Type of component</h3>
            <select value={selectedComponent} onChange={handleComponentChange}>
                <option value="">Select a type</option>
                {Object.keys(components).map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                ))}
            </select>
            <h3>Parameters of components</h3>
            {selectedComponent && (
                <div>
                    {Object.entries(publicPart).map(([key, value], index) => (
                        <div key={key + index}>
                            <h5>{key}</h5>
                            <Input
                                type="text"
                                placeholder={value ? value : `Enter ${key}`}
                                onChange={(event) => handlePublicPartChange(event, key)}
                                className="input-login-register"
                            />
                        </div>
                    ))}
                    <h5>depends on</h5>
                    {dependsPart.map((value, index) => (
                        <div key={index}>
                            <Input
                                type="text"
                                placeholder={`List ${value}`}
                                onChange={(event) => handleDependsPartChange(event, index)}
                                className="input-login-register"
                            />
                        </div>
                    ))}
                    <Button className="button-login-register" onClick={() => handleAddToDescriptor(selectedComponent)}>Add to descriptor</Button>
                </div>
            )}
            <div>
                <Descriptor yamlData={yaml.dump(descriptor)} handleRemoveFromDescriptor={handleRemoveFromDescriptor} />
                <br />
                <Button className="button-login-register" onClick={() => handleCreateTrialNetwork()}>Create Trial Network</Button>
                {trialNetworkCreated && (
                    <div>
                        <h5>Trial network created with identifier: {tnId}</h5>
                        <Button type="submit" className="button-login-register" disabled={isDeploying} onClick={handleDeployTrialNetwork}>
                            {isDeploying ? "Deploying..." : "Deploy Trial Network"}
                        </Button>
                    </div>
                )}
                {deployTrialNetworkCreated && (
                    <div>
                        <h5>Trial network successfully deployed</h5>
                    </div>
                )}
            </div>
        </div>
    );    
};