function isBoolean(value) {
    return value === true || value === false;
}
function isNotEmpty(value) {
    return (typeof value === "string" && value.trim().length > 0) || (typeof value === "number" && !isNaN(value));
}
function capitalizeFirstLetter(str) {
    return str === true ? "True" : str === false ? "False" : str;
}
function hasValues(diccionario) {
    return Object.entries(diccionario)
        .filter(([key]) => key !== "name") // Ignore name
        .some(([, value]) =>
            value !== undefined &&
            value !== null &&
            value !== "" &&
            !(Array.isArray(value) && value.length === 0)
        );
}

  
const convertJsonToYaml = (json,tnInit) => {
    let yamlString = "trial_network:\n"; // First line
    Object.entries(json).forEach(([key,component]) => {
        yamlString += `  ${component.fields.name ? (component.type + `-` + component.fields.name) : component.type}:\n`
        // Only the label of the component
        yamlString += `    type: "${component.type}"\n`
        // Only the name if allowed
        if (component.fields.name) {
            yamlString += `    name: "${component.fields.name}"\n`;
        }
        // Dependencies of the component
        yamlString += `    dependencies:`
        if (component.dependencies && component.dependencies.some(dependency => dependency.trim() !== "")) {
            yamlString += `\n`
            component.dependencies.forEach((dependency) => {
                //If the dependency is tn_init, then it will be added tn_vxlan as a dependency
                tnInit ? yamlString += `      - "tn_init"\n` : yamlString += `      - "${dependency.split("-"[0])}"\n`
            });
        } else {
            yamlString += ` []\n`
        }
        // Input of the component from the form data
        yamlString += `    input:`;
        // If the component has data, then it will be added to the yaml string
        if (component.fields && hasValues(component.fields)) {
            yamlString += `\n`
            Object.entries(component.fields).forEach(([key,value]) => {
                // Only add the real input and not the name or required field that are used for other things internally
                if (key !== "name") {
                    if(isBoolean(value)) {
                        yamlString += `      ${key}: ${capitalizeFirstLetter(value)}\n`;
                    } else {
                        if (isNotEmpty(value)) Number.isInteger(value) ? yamlString += `      ${key}: ${value}\n` : yamlString += `      ${key}: "${value}"\n`;
                        if (Array.isArray(value)) {
                            yamlString += `      ${key}: \n`
                            value.forEach((item) => {
                                yamlString += `        - "${item}"\n`
                            });
                        }
                    }
                }
            });
        } else {
            //If the component has no data, then it will be added an empty input
            yamlString += ` {}\n`
        }
      
    });
    return yamlString;
};

export default convertJsonToYaml;
