import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { getAccessTokenFromSessionStorage } from "../../auxFunc/jwt.js";

const fetchData = async () => {
  const access_token = await getAccessTokenFromSessionStorage();
  if (access_token) {
    const url = process.env.REACT_APP_ENDPOINT;
    const bearerJwt = `Bearer ${access_token}`;

    try {
      const response = await axios.get(`${url}/tnlcm/library/components/open5gcore_vm`, {
        headers: {
          Authorization: bearerJwt,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      alert(`Error fetching data for open5gcore_vm:`, error);
      return null;
    }
  }
  return null;
};

const Open5gcoreVM = ({ id, removeComponent, onChange, list1, list2,  whenError }) => {
  const [data, setData] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [errorMessages, setErrorMessages] = useState({});
  const [requiredFields, setRequiredFields] = useState({});

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchData();
      if (result) {
        setData(result.component_input);
        const deps=[];
        const required = [];  // Array to store the required fields
        // Initialize form values with default values
        const initialValues = {};
        for (const key in result.component_input) {
          const field = result.component_input[key];
          
          // No default values if the field is special type
          if (field.type === "str" || field.type === "int" || field.type === "bool") {
            initialValues[key] = field.default_value || "";
          } else {
            initialValues[key] ="";
            deps.push(key);
          }
          
          if (field.required_when) {
            required.push(key);
          }
        }
        required.push("name");
        initialValues['name'] = '';
        initialValues['required']=required;
        initialValues['dependencies']=deps;
        setFormValues(initialValues);
        setRequiredFields(required);
        // call onChange to update the state in the parent component with the initial values
        for (const key in initialValues) {
          onChange(id, key, initialValues[key]);
        }
      }
    };
    loadData();
  }, [id, onChange]);

  useEffect(() => {
      // Make sure that "one_loadcore_agent_networks" is an array
      const networks1 = Array.isArray(formValues["one_open5gcore_vm_external_vnet"])
        ? formValues["one_open5gcore_vm_external_vnet"]
        : [];
    
      // Filter out any networks that are not in the list of available networks
      const validNetworks1 = networks1.filter((network) => list1.includes(network));
    
      // If the length of validNetworks is different from the length of networks, update the formValues
      if (validNetworks1.length !== networks1.length) {
        setFormValues((prevState) => ({
          ...prevState,
          "one_open5gcore_vm_external_vnet": validNetworks1,  // Update the selected networks state
        }));
    
        // Call onChange to update the state in the parent component
        onChange(id, "one_open5gcore_vm_external_vnet", validNetworks1);
      }
  
      const networks2 = Array.isArray(formValues["one_open5gcore_vm_internal_vnet"])
        ? formValues["one_open5gcore_vm_internal_vnet"]
        : [];
      const validNetworks2 =networks2.filter((network) => list2.includes(network));
      if (validNetworks2.length !== networks2.length) {
        setFormValues((prevState) => ({
          ...prevState,
          "one_open5gcore_vm_internal_vnet": validNetworks2,  // Update the selected networks state
        }));
    
        // Call onChange to update the state in the parent component
        onChange(id, "one_open5gcore_vm_internal_vnet", validNetworks2);
      }
  
    }, [list1,list2,formValues,id,onChange]);

    const handleCheckboxChange = (event, key, network) => {
        // Make sure that the value of the field is an array
        const currentValue = Array.isArray(formValues[key]) ? formValues[key] : [];
    
        const updatedNetworks = event.target.checked
        ? [...currentValue, network] // If it is selected, add it to the list
        : currentValue.filter((n) => n !== network);
    
        // Update the formValues with the updated networks
        setFormValues((prevState) => ({
          ...prevState,
          [key]: updatedNetworks,
        }));
      
        // Call onChange to update the state in the parent component
        onChange(id, key, updatedNetworks);
      };
  
  const handleChange = (event) => {
    const { name, value } = event.target;

    // Update the form values with the new value entered by the user
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,  // Update the value of the field that has changed
    }));

    // Call onChange to update the state in the parent component with the new values
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

    if (name === "one_open5gcore_vm_amf_ip" || name === "one_open5gcore_vm_upf_ip") {
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
    if (name === "one_open5gcore_vm_mcc") {
      if (!isValidMCC(value)) {
        setErrorMessages((prevState) => ({
          ...prevState,
          [name]: `Must be only 3 digits in ${name}`,
        }));
        whenError(id, name, `Must be only 3 digits in ${name}`);
      } else if (
        ((value ?? "").replace(/"/g, "").length +
          (formValues.one_open5gcore_vm_mnc ?? "").replace(/"/g, "").length +
          (formValues.one_open5gcore_vm_msin ?? "").replace(/"/g, "").length) !== 15
      ) {
        setErrorMessages((prevState) => ({
          ...prevState,
          [name]: `MCC + MNC + MSIN must add to exactly 15 digits`,
        }));
        whenError(id, name, `MCC + MNC + MSIN must add to exactly 15 digits`);
      } else {
        setErrorMessages((prevState) => {
          const newState = { ...prevState };
          delete newState[name];
          return newState;
        });
        whenError(id, name, null);
      }
    }
    
    if (name === "one_open5gcore_vm_mnc") {
      if (!isValidMNC(value)) {
        setErrorMessages((prevState) => ({
          ...prevState,
          [name]: `Must be 2 or 3 digits in ${name}`,
        }));
        whenError(id, name, `Must be 2 or 3 digits in ${name}`);
      } else if (
        ((formValues.one_open5gcore_vm_mcc ?? "").replace(/"/g, "").length +
          (value ?? "").replace(/"/g, "").length +
          (formValues.one_open5gcore_vm_msin ?? "").replace(/"/g, "").length) !== 15
      ) {
        setErrorMessages((prevState) => ({
          ...prevState,
          [name]: `MCC + MNC + MSIN must add to exactly 15 digits`,
        }));
        whenError(id, name, `MCC + MNC + MSIN must add to exactly 15 digits`);
      } else {
        setErrorMessages((prevState) => {
          const newState = { ...prevState };
          delete newState[name];
          return newState;
        });
        whenError(id, name, null);
      }
    }
    
    if (name === "one_open5gcore_vm_msin") {
      if (!isValidMSIN(value)) {
        setErrorMessages((prevState) => ({
          ...prevState,
          [name]: `Must be 9 or 10 digits in ${name}`,
        }));
        whenError(id, name, `Must be 9 or 10 digits in ${name}`);
      } else if (
        ((formValues.one_open5gcore_vm_mcc ?? "").replace(/"/g, "").length +
          (formValues.one_open5gcore_vm_mnc ?? "").replace(/"/g, "").length +
          (value ?? "").replace(/"/g, "").length) !== 15
      ) {
        setErrorMessages((prevState) => ({
          ...prevState,
          [name]: `MCC + MNC + MSIN must add to exactly 15 digits`,
        }));
        whenError(id, name, `MCC + MNC + MSIN must add to exactly 15 digits`);
      } else {
        setErrorMessages((prevState) => {
          const newState = { ...prevState };
          delete newState[name];
          return newState;
        });
        whenError(id, name, null);
      }
    }

    if (name === "one_open5gcore_vm_s_nssai_sd"){
      if (!isValidNSSD(value)) {
        setErrorMessages((prevState) => ({
          ...prevState,
          [name]: `Must be 6 or more digits in ${name}`,
        }));
        whenError(id, name, `Must be 6 or more digits in ${name}`);
      } else {
        setErrorMessages((prevState) => {
          const newState = { ...prevState };
          delete newState[name];
          return newState;
        });
        whenError(id, name, null);
      }
    }

  };

  const isValidMCC = (mcc) => /^\d{3}$/.test(mcc);  // 3 digits
  const isValidMNC = (mnc) => /^\d{2,3}$/.test(mnc); // 2 or 3 digits
  const isValidMSIN = (msin) => /^\d{9,10}$/.test(msin); // 9 or 10 digits
  const isValidNSSD = (nssd) => /^\d{6,}$/.test(nssd); // 6 or more digits


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

    // Check if the value is an integer
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

  // If no fields are loaded, show a message indicating that the component has been added
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
          <h1 className="text-3xl font-bold">OPEN5GCORE_VM Added</h1>
          <p className="mt-2">The OPEN5GCORE_VM component has been added successfully.</p>
        </header>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-6">
      {/* Header with delete button */}
      <header className="bg-blue-500 text-white text-center p-4 rounded-md shadow-md">
        <button
          onClick={() => removeComponent(id)}
          className="flex text-red-500"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
        <h1 className="text-3xl font-bold">Open5Gcore_VM Config</h1>
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
            if (key === "one_open5gcore_vm_external_vnet"){
                return (
                  <div key={key} className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">
                    {key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}:
                    </label>
                    {list1.map((network, index) => (
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
                    {list1.length === 0 || list1 === ""
                      ? "Create news vnets or tn_vxlan to be able to select"
                      : "Select one or more networks to include"
                    }
                  </small>
                  </div>
                );
              }

              if(key === "one_open5gcore_vm_internal_vnet"){
                return (
                  <div key={key} className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">
                    {key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}:
                    </label>
                    {list2.map((network, index) => (
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
                    {list2.length === 0 || list2 === ""
                      ? "Create news vnets to be able to select"
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

export default Open5gcoreVM;
