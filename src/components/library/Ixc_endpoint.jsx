import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { getComponent } from "../../auxFunc/api";

const IxcEndpoint = ({ id, removeComponent, onChange, list, whenError, defaultValues, name,request }) => {
  const [data, setData] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [errorMessages, setErrorMessages] = useState({});
  const [requiredFields, setRequiredFields] = useState({});
  const hasFetched = useRef(false);
  useEffect(() => {
    const loadData = async () => {
      if (hasFetched.current) return;
      hasFetched.current = true;
      let result= null;
      result = await getComponent(
        request[0],
        request[1],
        request[2]
      );
      if (result) {
        setData(result.component_input);
        const required = [];  // Array to store the required fields
        const deps=[];
        // Initialize form values with default values
        const initialValues = {};
        for (const key in result.component_input) {
          const field = result.component_input[key];
          
          // No default values if the field is special type
          if (field.type === "str" || field.type === "int" || field.type === "bool") {
            initialValues[key] = field.default_value || "";
            if (defaultValues && key in defaultValues){
              initialValues[key] = defaultValues[key];
            }
          } else {
            initialValues[key] ="";
            deps.push(key);
            if (defaultValues && key in defaultValues){
              initialValues[key] = defaultValues[key];
            }
          }
          
          if (field.required_when === true) {
            required.push(key);
          }
        }
        required.push("name");
        name ? initialValues['name'] = name : initialValues['name'] = '';
        initialValues['required']=required;
        initialValues['dependencies']=deps;
        setFormValues(initialValues);
        setRequiredFields(required);
        // Call onChange to send default values to the parent component
        for (const key in initialValues) {
          onChange(id, key, initialValues[key]);
        }
      }
    };
    loadData();
  }, [id, onChange, defaultValues, name, request]);

  useEffect(() => {
      // Make sure that  is an array
      const networks = Array.isArray(formValues["one_ixc_endpoint_networks"])
        ? formValues["one_ixc_endpoint_networks"]
        : [];
    
      // Filter the selected networks to keep only the valid ones
      const validNetworks = networks.filter((network) => list.includes(network));
    
      // If the number of valid networks is different from the number of selected networks
      if (validNetworks.length !== networks.length) {
        setFormValues((prevState) => ({
          ...prevState,
          "one_ixc_endpoint_networks": validNetworks,  // Update the form values
        }));
    
        // Call onChange to update the state in the parent component
        onChange(id, "one_ixc_endpoint_networks", validNetworks);
      }
    }, [list,formValues,id,onChange]);

    const handleCheckboxChange = (event, key, network) => {
      const updatedNetworks = event.target.checked
        ? [...formValues[key], network] // If it is selected, add it to the list
        : formValues[key].filter((n) => n !== network);
    
      // Update the form values with the new list of networks
      setFormValues((prevState) => ({
        ...prevState,
        [key]: updatedNetworks,
      }));
    
      // Call onChange to update the state in the parent component
      onChange(id, key, updatedNetworks);
    };

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Update the form values with the new value
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,  // Update the value for the field
    }));

    // call onChange to send the new value to the parent component
    onChange(id, name, value);

    // Field validation
    if (requiredFields.includes(name)) {
      if (value.trim() === "") {
        setErrorMessages((prevState) => ({
          ...prevState,
          [name]: `${name} cannot be empty.`,
        }));
      } else {
        setErrorMessages((prevState) => {
          const newState = { ...prevState };
          delete newState[name];
          return newState;
        });
      }
    }
    if (name === "one_ixc_endpoint_rs" ) { // Special validation for being sure that only IPs are allowed
        if(!isValidIPv4(value)){
          setErrorMessages((prevState) => ({
            ...prevState,
            [name]: `Invalid IP in ${name}`,
          }));
          whenError(id,name,`Invalid IP in ${name}`);
        }else {
          setErrorMessages((prevState) => {
            const newState = { ...prevState };
            delete newState[name];
            return newState;
          });
          whenError(id,name,null);
        }
      }
  };

  const isValidIPv4 = (ip) => {
    const ipv4Pattern =
      /^(25[0-5]|2[0-4]\d|1\d\d|\d\d|\d)\.(25[0-5]|2[0-4]\d|1\d\d|\d\d|\d)\.(25[0-5]|2[0-4]\d|1\d\d|\d\d|\d)\.(25[0-5]|2[0-4]\d|1\d\d|\d\d|\d)$/;
    return ipv4Pattern.test(ip.trim());
  };

  const validateInteger = (value) => {
    return Number.isInteger(Number(value));
  };

  const handleIntegerValidation = (event, key) => {
    const value = event.target.value;
    setFormValues((prevState) => ({
      ...prevState,
      [key]: value,
    }));

    // Validate if the value is an integer
    if (!validateInteger(value)) {
      setErrorMessages((prevState) => ({
        ...prevState,
        [key]: `${key.replace(/_/g, " ")} must be an integer.`,
      }));
      whenError(id, key, `${key.replace(/_/g, " ")} must be an integer.`);
    } else {
      setErrorMessages((prevState) => {
        const newState = { ...prevState };
        delete newState[key];
        return newState;
      });
      whenError(id, key, null);
    }
  };

  // Show success message if data is null
  if (data === null) {
    return (
      <div className="bg-gray-100 p-6">
        <header className="bg-blue-500 text-white text-center p-4 rounded-md shadow-md">
          <button
            onClick={() => removeComponent(id)}
            className="flex text-red-500"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
          <h1 className="text-3xl font-bold">IXC_ENDPOINT Added</h1>
          <p className="mt-2">The IXC_ENDPOINT component has been added successfully.</p>
        </header>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-6">
      {/* Header with close button */}
      <header className="bg-blue-500 text-white text-center p-4 rounded-md shadow-md">
        <button
          onClick={() => removeComponent(id)}
          className="flex text-red-500"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
        <h1 className="text-3xl font-bold">IXC_ENDPOINT Configuration</h1>
        <p className="mt-2">Please fill in the fields below to configure the system</p>
      </header>

      <div className="mt-8 bg-white shadow-md rounded-lg p-6">
        <form>
          {/* Additional field 'name' */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-semibold">
              Name:
            </label>
            <input
              type="text"
              id={`name-${id}`}
              name="name"
              value={formValues.name || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
            />
            {errorMessages.name && (
              <small className="block mt-1 text-red-500">{errorMessages.name}</small>
            )}
          </div>

          {Object.keys(data).map((key) => {
            const field = data[key];
            if (key === "one_ixc_endpoint_networks") {
              return (
                <div key={key} className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">
                  {key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}:
                  </label>
                  {list.map((network, index) => (
                    <div key={index} className="flex items-center mb-1">
                      <input
                        type="checkbox"
                        id={`${key}_${index}`}
                        name={key}
                        value={network}
                        checked={formValues[key]?.includes(network) || false}
                        onChange={(event) => handleCheckboxChange(event, key, network)}
                        className="mr-2"
                      />
                      <label htmlFor={`${key}_${index}`} className="text-gray-700">
                        {network}
                      </label>
                    </div>
                  ))}
                 <small className="block mt-1 text-gray-500">
                  {list.length === 0 || list === ""
                    ? "Create news vnets or tn_vxlans to be able to select"
                    : "Select one or more networks to include"
                  }
                </small>
                </div>
              );
            }

            return (
              <div className="mb-4" key={key}>
                <label htmlFor={key} className="block text-gray-700 font-semibold">
                  {key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}:
                </label>

                {/* Input or select if there are a 'choices' type */}
                {field.choices ? (
                  <select
                    id={key}
                    name={key}
                    value={formValues[key] || ""}
                    onChange={(event) => handleChange(event)}
                    className="w-full border border-gray-300 rounded-md p-2 mt-1"
                  >
                    <option disabled value="">Select an option</option>
                    {field.choices.map((choice, index) => (
                      <option key={index} value={choice}>
                        {choice}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    id={key}
                    name={key}
                    value={Array.isArray(formValues[key]) ? formValues[key].join(", ") : formValues[key] || ""}
                    onChange={(event) => {
                      if (field.type === "int") {
                        handleIntegerValidation(event, key);
                      } else {
                        handleChange(event);
                      }
                    }}
                    className="w-full border border-gray-300 rounded-md p-2 mt-1"
                  />
                )}

                {errorMessages[key] && (
                  <small className="block mt-1 text-red-500">{errorMessages[key]}</small>
                )}
                <small className="block mt-1 text-gray-500">{field.description}</small>
              </div>
            );
          })}
        </form>
      </div>
    </div>
  );
};

export default IxcEndpoint;
