import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { getComponent } from "../../auxFunc/api";

const Ks8500Runner = ({ id, removeComponent, onChange, list, whenError, defaultValues, name, request }) => {
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
        const required = [];
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
        // Call onChange to send the default values to the parent component
        for (const key in initialValues) {
          onChange(id, key, initialValues[key]); // Send the default values to the parent component
        }
      }
    };
    loadData();
  }, [id, onChange, defaultValues, name, request]);

  useEffect(() => {
    // Make sure that "one_ks8500runner_networks" is an array
    const networks = Array.isArray(formValues["one_ks8500runner_networks"])
      ? formValues["one_ks8500runner_networks"]
      : [];
  
    // Filter the networks to keep only the valid ones
    const validNetworks = networks.filter((network) => list.includes(network));
  
    // If the number of valid networks is different from the number of networks, update the state
    if (validNetworks.length !== networks.length) {
      setFormValues((prevState) => ({
        ...prevState,
        "one_ks8500runner_networks": validNetworks,  // Update the list of networks
      }));
  
      // call onChange to update the parent component
      onChange(id, "one_ks8500runner_networks", validNetworks);
    }
  }, [list,formValues,id,onChange]);
  

  
  const handleCheckboxChange = (event, key, network) => {
    const updatedNetworks = event.target.checked
      ? [...formValues[key], network] // If it is selected, add it to the list
      : formValues[key].filter((n) => n !== network);
  
    // Update the state with the new list of networks
    setFormValues((prevState) => ({
      ...prevState,
      [key]: updatedNetworks,
    }));
  
    // call onChange to update the parent component
    onChange(id, key, updatedNetworks);
  };

  
  const handleChange = (event) => {
    const { name, value } = event.target;

    // Update the form values with the new value
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,  // Update the value for the field
    }));

    // Call onChange to send the new value to the parent component
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
    // Validate special case such as URL input
    if (name === "ks8500runner_backend_url"){
      if(!isValidURL(value)){
        setErrorMessages((prevState) => ({
          ...prevState,
          [name]: `Invalid URL format in ${name}`,
        }));
        whenError(id,name,`Invalid URL format in ${name}`);
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

  const isValidURL = (str) => {
    try {
      new URL(str);
      return true;
    } catch (e) {
      return false;
    }
  };
  


  // If the data is null, show a message that the component has been added
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
          <h1 className="text-3xl font-bold">KS8500_RUNNER Added</h1>
          <p className="mt-2">The KS8500_RUNNER component has been added successfully.</p>
        </header>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-6 relative">
      <header className="bg-blue-500 text-white text-center p-4 rounded-md shadow-md">
        <button
          onClick={() => removeComponent(id)}
          className="flex text-red-500"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
        <h1 className="text-3xl font-bold">KS8500 Runner Configuration</h1>
        <p className="mt-2">Please fill in the fields below to configure the system</p>
      </header>

      <div className="mt-8 bg-white shadow-md rounded-lg p-6">
        <form>
           {/* Additional field name */}
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
            if (key === "one_ks8500runner_networks") {
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
                    ? "Create news vnets or tn_vxlan to be able to select"
                    : "Select one or more networks to include"
                  }
                </small>
                </div>
              );
            }
            
            
            

            if (key === "ks8500runner_special_action") {
              return (
                <div key={key} className="mb-4">
                  <label htmlFor={key} className="block text-gray-700 font-semibold">
                    {key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}:
                  </label>
                  <select
                    id={key}
                    name={key}
                    value={formValues[key]}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2 mt-1"
                  >
                    <option value="none">None</option>
                    <option value="delete_runner_data">Delete Runner Data</option>
                  </select>
                  <small className="block mt-1 text-gray-500">{field.description}</small>
                </div>
              );
            }

            return (
              <div key={key} className="mb-4">
                <label htmlFor={key} className="block text-gray-700 font-semibold">
                  {key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}:
                </label>
                <input
                  type="text"
                  id={key}
                  name={key}
                  value={Array.isArray(formValues[key]) ? formValues[key].join(", ") : formValues[key] || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 mt-1"
                />
                <small className="block mt-1 text-gray-500">{field.description}</small>
                {errorMessages[key] && <p className="text-red-500">{errorMessages[key]}</p>}
              </div>
            );
          })}
        </form>
      </div>
    </div>
  );
};

export default Ks8500Runner;
