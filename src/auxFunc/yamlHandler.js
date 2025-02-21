//TODO WIP - This function is not working yet. It is supposed to convert a JSON object to a YAML string
const convertJsonToYaml = (json) => {
    let yamlString = "trial_network:\n\n"; // First line and empty line

    json.components.forEach(component => {
        //Full component label also with the name if it exists becouse the component is allowed to have one
        const name = component.data.name? component.label+"-"+component.data.name : component.label;
        yamlString += `  ${name}:\n`
        //Only the label of the component
        yamlString += `    type: ${component.label}\n`
        //Only the name if allowed
        if (component.data.name) {
            yamlString += `    name: ${component.data.name}\n`;
        }
        //Dependencies of the component
        yamlString += `    dependencies: []\n`
        //Input of the component from the form data
        yamlString += `    input: {}\n`;
        
    });
    console.log(yamlString);
    return yamlString;
};

export default convertJsonToYaml;
