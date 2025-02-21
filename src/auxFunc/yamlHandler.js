//TODO WIP - This function is not working yet. It is supposed to convert a JSON object to a YAML string
const convertJsonToYaml = (json) => {
    let yamlString = "trial_network:\n\n"; // First line and empty line

    json.components.forEach(component => {
        const name = component.data.name? component.label+"-"+component.data.name : component.label;
        yamlString += `  ${name}:\n`
        yamlString += `    type: ${component.label}\n`
        if (component.data.name) {
            yamlString += `    name: ${component.data.name}\n`;
        }
        yamlString += `    dependencies: []\n`
        yamlString += `    input: {}\n`;
        
    });
    console.log(yamlString);
    return yamlString;
};

export default convertJsonToYaml;
