const convertJsonToYaml = (json, tnInit) => {
  let yamlString = "trial_network:\n"; // First line
  Object.entries(json).forEach(([key, component]) => {
    yamlString += `  ${
      component.fields.name
        ? component.type + `-` + component.fields.name
        : component.type
    }:\n`;
    // Only the label of the component
    yamlString += `    type: "${component.type}"\n`;
    // Only the name if allowed
    if (component.fields.name) {
      yamlString += `    name: "${component.fields.name}"\n`;
    }
    // Dependencies of the component
    yamlString += `    dependencies:`;
    if (
      component.dependencies &&
      component.dependencies.some((dependency) => dependency.trim() !== "")
    ) {
      yamlString += `\n`;
      component.dependencies.forEach((dependency) => {
        //If the dependency is tn_vxlan, but we are working with tn_init, then it will be added tn_init as a dependency
        tnInit && dependency === "tn_vxlan"
          ? (yamlString += `      - "tn_init"\n`)
          : (yamlString += `      - "${dependency}"\n`);
      });
    }
    if (component.type === "tn_init" || component.type === "tn_vxlan") {
      yamlString += ` []\n`;
    } else if (component.type === "tn_bastion") {
      if (
        !(
          component.dependencies &&
          component.dependencies.some((dependency) => dependency.trim() !== "")
        )
      ) {
        yamlString += `\n`;
      }
      yamlString += `      - "tn_vxlan"\n`;
    } else {
      if (
        !(
          component.dependencies &&
          component.dependencies.some((dependency) => dependency.trim() !== "")
        )
      ) {
        yamlString += `\n`;
      }
      if (component.dependencies.includes("tn_vxlan")) {
        yamlString += `      - "tn_bastion"\n`;
      } else if (component.dependencies.includes("tn_init")) {
      } else {
        tnInit
          ? (yamlString += `      - "tn_init"\n`)
          : (yamlString += `      - "tn_vxlan"\n      - "tn_bastion"\n`);
      }
    }
    // Input of the component from the form data
    yamlString += `    input:`;
    // If the component has data, then it will be added to the yaml string
    if (component.fields && hasValues(component.fields)) {
      yamlString += `\n`;
      Object.entries(component.fields).forEach(([key, value]) => {
        // Only add the real input and not the name or required field that are used for other things internally
        if (key !== "name") {
          if (isBoolean(value)) {
            yamlString += `      ${key}: ${value}\n`;
          } else {
            if (isNotEmpty(value))
              Number.isInteger(value)
                ? (yamlString += `      ${key}: ${value}\n`)
                : (tnInit && value === "tn_init")
                ? (yamlString += `      ${key}: "tn_vxlan"\n`)
                : (yamlString += `      ${key}: "${value}"\n`);
            if (Array.isArray(value)) {
              yamlString += `      ${key}: \n`;
              value.forEach((item) => {
                if (tnInit && item === "tn_init") {
                  yamlString += `        - "tn_vxlan"\n`;
                } else {
                  yamlString += `        - "${item}"\n`;
                }
              });
            }
          }
        }
      });
    } else {
      //If the component has no data, then it will be added with an empty input
      yamlString += ` {}\n`;
    }
  });
  return yamlString;
};

function isBoolean(value) {
  return (value === "true") || (value === "false");
}

function isNotEmpty(value) {
  return (
    (typeof value === "string" && value.trim().length > 0) ||
    (typeof value === "number" && !isNaN(value))
  );
}

function hasValues(diccionario) {
  return Object.entries(diccionario)
    .filter(([key]) => key !== "name") // Ignore name
    .some(
      ([, value]) =>
        value !== undefined &&
        value !== null &&
        value !== "" &&
        !(Array.isArray(value) && value.length === 0)
    );
}

export default convertJsonToYaml;
