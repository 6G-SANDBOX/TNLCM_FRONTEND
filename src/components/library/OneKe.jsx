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
      const response = await axios.get(`${url}/tnlcm/library/components/oneKE`, {
        headers: {
          Authorization: bearerJwt,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      alert(`Error fetching data for oneKE:`, error);
      return null;
    }
  }
  return null;
};

const OneKe = ({ id, removeComponent, onChange, list1, list2, whenError, defaultValues, name }) => {
  const [data, setData] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [errorMessages, setErrorMessages] = useState({});
  const [requiredFields, setRequiredFields] = useState({});

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchData();
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
            initialValues[key] = field.default_value ;
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
          
          if (field.required_when) {
            required.push(key);
          }
        }
        required.push("name");
        name ? initialValues['name'] = name : initialValues['name'] = '';
        initialValues['required']=required;
        initialValues['dependencies']=deps;
        setFormValues(initialValues);
        setRequiredFields(required);
        // Call onChange to update the state in the parent component
        for (const key in initialValues) {
          onChange(id, key, initialValues[key]);
        }
      }
    };
    loadData();
  }, [id, onChange, defaultValues, name]);

  useEffect(() => {
    // Make sure that "one_loadcore_agent_networks" is an array
    const networks1 = Array.isArray(formValues["one_oneKE_external_vnet"])
      ? formValues["one_oneKE_external_vnet"]
      : [];
  
    // Filter out any networks that are not in the list of available networks
    const validNetworks1 = networks1.filter((network) => list1.includes(network));
  
    // If the length of validNetworks is different from the length of networks, update the formValues
    if (validNetworks1.length !== networks1.length) {
      setFormValues((prevState) => ({
        ...prevState,
        "one_oneKE_external_vnet": validNetworks1,  // Update the selected networks state
      }));
  
      // Call onChange to update the state in the parent component
      onChange(id, "one_oneKE_external_vnet", validNetworks1);
    }

    const networks2 = Array.isArray(formValues["one_oneKE_internal_vnet"])
      ? formValues["one_oneKE_internal_vnet"]
      : [];
    const validNetworks2 =networks2.filter((network) => list2.includes(network));
    if (validNetworks2.length !== networks2.length) {
      setFormValues((prevState) => ({
        ...prevState,
        "one_oneKE_internal_vnet": validNetworks2,  // Update the selected networks state
      }));
  
      // Call onChange to update the state in the parent component
      onChange(id, "one_oneKE_internal_vnet", validNetworks2);
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

    // Update the formValues with the new value
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // call onChange to update the state in the parent component
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

    // Validate special case such as IP RANGE
    if (name === "one_oneKE_metallb_range" || name === "one_oneKE_cilium_range") {
      if(!isValidIPv4Range(value)){
        setErrorMessages((prevState) => ({
          ...prevState,
          [name]: `Invalid IP RANGE format in ${name}`,
        }));
        whenError(id,name,`Invalid IP RANGE format in ${name}`);
      }else {
        setErrorMessages((prevState) => {
          const newState = { ...prevState };
          delete newState[name];
          return newState;
        });
        console.log("clearing error");
        whenError(id,name,"");
      }
    }

    if (name === "one_oneKE_dns"){
      if(!isValidIPv4List(value)){
        setErrorMessages((prevState) => ({
          ...prevState,
          [name]: `Invalid IP list format in ${name}`,
        }));
        whenError(id,name,`Invalid IP list format in ${name}`);
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

  const isValidIPv4Range = (str) => {
    const ipv4Pattern =
      /^(25[0-5]|2[0-4]\d|1\d\d|\d\d|\d)\.(25[0-5]|2[0-4]\d|1\d\d|\d\d|\d)\.(25[0-5]|2[0-4]\d|1\d\d|\d\d|\d)\.(25[0-5]|2[0-4]\d|1\d\d|\d\d|\d)$/;
  
    const rangePattern = /^(\d{1,3}(\.\d{1,3}){3})-(\d{1,3}(\.\d{1,3}){3})$/;
    const match = str.match(rangePattern);
  
    if (!match) return false; // Does not match the range pattern
  
    const [, ip1, , ip2] = match;
  
    if (!ipv4Pattern.test(ip1) || !ipv4Pattern.test(ip2)) return false; // Validating IPs
  
    // Make sure that min_IPv4 <= max_IPv4
    const ipToNumber = (ip) =>
      ip.split(".").reduce((acc, octet) => acc * 256 + Number(octet), 0);
  
    return ipToNumber(ip1) <= ipToNumber(ip2); 
  };

  const isValidIPv4List = (str) => {
    // Regular expression to validate an IPv4 address
    const ipv4Pattern =
      /^(25[0-5]|2[0-4]\d|1\d\d|\d\d|\d)\.(25[0-5]|2[0-4]\d|1\d\d|\d\d|\d)\.(25[0-5]|2[0-4]\d|1\d\d|\d\d|\d)\.(25[0-5]|2[0-4]\d|1\d\d|\d\d|\d)$/;
  
    // Split the string into a list of IPs
    const ipList = str.trim().split(/\s+/);
  
    // Verify that all IPs in the list are valid
    return ipList.every((ip) => ipv4Pattern.test(ip));
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

    // Validate the integer value
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

  // If the data is null, show a message indicating that the component has been added
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
          <h1 className="text-3xl font-bold">ONE_KE Added</h1>
          <p className="mt-2">The ONE_KE component has been added successfully.</p>
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
        <h1 className="text-3xl font-bold">OneKE Config</h1>
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
            if (key === "one_oneKE_external_vnet"){
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
            if(key === "one_oneKE_internal_vnet"){
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
            
                {/* Select if 'choices' exist or type is 'bool' */}
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
                ) : field.type === "bool" ? (
                  <select
                    id={key}
                    name={key}
                    value={formValues[key] !== undefined ? String(formValues[key]) : ""}
                    onChange={(event) => handleChange({ target: { name: key, value: event.target.value === "true" } })}
                    className="w-full border border-gray-300 rounded-md p-2 mt-1"
                  >
                    <option disabled value="False">Select true or false</option>
                    <option value="True">True</option>
                    <option value="False">False</option>
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
            
                {errorMessages[key] && <small className="block mt-1 text-red-500">{errorMessages[key]}</small>}
                <small className="block mt-1 text-gray-500">{field.description}</small>
              </div>
            );
          })}
        </form>
      </div>
    </div>
  );
};

export default OneKe;
