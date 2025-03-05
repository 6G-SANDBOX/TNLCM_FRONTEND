function isBoolean(value) {
    return value === true || value === false;
}
function isNotEmpty(value) {
    return (typeof value === "string" && value.trim().length > 0) || (typeof value === "number" && !isNaN(value));
}
function capitalizeFirstLetter(str) {
    
    return str === true ? "True" : str === false ? "False" : str;
}

  
const convertJsonToYaml = (json,tnInit) => {
    let yamlString = "trial_network:\n\n"; // First line and empty line

    json.components.forEach(component => {
        //Full component label also with the name if it exists becouse the component is allowed to have one
        const name = component.data.name? component.label+"-"+component.data.name : component.label;
        yamlString += `  ${name}:\n`
        //Only the label of the component
        yamlString += `    type: "${component.label}"\n`
        //Only the name if allowed
        if (component.data.name) {
            yamlString += `    name: "${component.data.name}"\n`;
        }
        //Dependencies of the component
        yamlString += `    dependencies:`
        if (component.data.dependencies && component.data.dependencies.some(dependency => dependency.trim() !== "")) {
            yamlString += `\n`
            component.data.dependencies.forEach((dependency) => {
                if (dependency.trim() !== "") { // Not empty or just spaces
                    //If the dependency is tn_init, then it will be added tn_vxlan as a dependency
                    if (tnInit) component.data[dependency]==="tn_vxlan" ? yamlString += `      - "tn_init"\n` : yamlString += `      - "${component.data[dependency]}"\n`
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
                    if(isBoolean(value)) {
                        yamlString += `      ${key}: ${capitalizeFirstLetter(value)}\n`;
                    } else {
                        if (isNotEmpty(value)) Number.isInteger(value) ? yamlString += `      ${key}: ${value}\n` : yamlString += `      ${key}: "${value}"\n`;
                    }
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
