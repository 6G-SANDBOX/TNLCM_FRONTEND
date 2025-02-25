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
        yamlString += `    dependencies:`
        if (component.data.dependencies && component.data.dependencies.some(dependency => dependency.trim() !== "")) {
            yamlString += `\n`
            component.data.dependencies.forEach((dependency) => {
                if (dependency.trim() !== "") { // Verifica que no sea vacío ni solo espacios
                    yamlString += `      - ${dependency}\n`
                }
            });
        } else {
            yamlString += ` []\n`
        }
        //Input of the component from the form data
        yamlString += `    input:`;
        //If the component has data, then it will be added to the yaml string
        if (component.data){
            yamlString += `\n`
            Object.entries(component.data).forEach( ([key,value]) => {
                //Only add the real input and not the name or required field that are used for other things internally
                if ((key !== "required") && (key !== "name") && (key !== "dependencies")){
                    yamlString += `      ${key}: ${value}\n`
                }
            });
        } else {
            //If the component has no data, then it will be added an empty input
            yamlString += `{}\n`
        }
      
    });
    return yamlString;
};

export default convertJsonToYaml;
