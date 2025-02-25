import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { getAccessTokenFromSessionStorage } from "../../auxFunc/jwt.js";

const fetchData = async () => {
  const access_token = await getAccessTokenFromSessionStorage();
  if (access_token) {
    const url = process.env.REACT_APP_ENDPOINT;
    const bearerJwt = `Bearer ${access_token}`;

    try {
      const response = await axios.get(`${url}/tnlcm/library/components/ueransim`, {
        headers: {
          Authorization: bearerJwt,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      alert(`Error fetching data for ueransim:`, error);
      return null;
    }
  }
  return null;
};
const Ueransim = ({ id, removeComponent, onChange, list1, list2, list3, whenError }) => {
  const [data, setData] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [errorMessages, setErrorMessages] = useState({});
  const [requiredFields, setRequiredFields] = useState({});

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchData();
      if (result) {
        setData(result.component_input);
        const required = [];  // Array to store the required fields
        const deps={};
        // Initialize form values with default values
        const initialValues = {};
        for (const key in result.component_input) {
          const field = result.component_input[key];
          
          // No default values if the field is special type
          if (field.type !== "str" || field.type !== "int" || field.type !== "bool") {
            initialValues[key] = field.default_value || "";
          } else {
            initialValues[key] ="";
            deps[key]="";
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
        // Call onChange to update the state in the parent component with the initial values
        for (const key in initialValues) {
          onChange(id, key, initialValues[key]);
        }
      } else {
        setData(null);  // If no data due to no fields put it into null
      }
    };
    loadData();
  }, [id, onChange]);

  useEffect(() => {
    // Make sure that "one_ueransim_networks" is an array
    const networks = Array.isArray(formValues["one_ueransim_networks"])
      ? formValues["one_ueransim_networks"]
      : [];
  
    // Filter out the networks that are not in the list
    const validNetworks = networks.filter((network) => list1.includes(network));
  
    // If  the length of the valid networks is different from the length of the original networks
    if (validNetworks.length !== networks.length) {
      setFormValues((prevState) => ({
        ...prevState,
        "one_ueransim_networks": validNetworks,  // Update the form values with the valid networks
      }));
  
      // call onChange to update the state in the parent component with the valid networks
      onChange(id, "one_ueransim_networks", validNetworks);
    }
  }, [list1,formValues,id,onChange]);

  // UseEffect for specific fields
  useEffect(() => {
    setRequiredFields((prevState) => {
      let newRequiredFields = { ...prevState };
  
      // Check when is mandatory one_ueransim_gnb_linked_open5gs
      if (formValues["one_ueransim_run_gnb"] === "YES") {
        if (!Object.values(newRequiredFields).includes("one_ueransim_gnb_linked_open5gs")) {
          newRequiredFields[Object.keys(newRequiredFields).length] = "one_ueransim_gnb_linked_open5gs";
        }
      } else {
        // if the condition is not met, remove it from requiredFields
        newRequiredFields = Object.fromEntries(
          Object.entries(newRequiredFields).filter(([_, value]) => value !== "one_ueransim_gnb_linked_open5gs")
        );
      }
  
      // Check when is mandatory one_ueransim_ue_linked_gnb
      if (formValues["one_ueransim_run_gnb"] === "NO" && formValues["one_ueransim_run_ue"] === "YES") {
        if (!Object.values(newRequiredFields).includes("one_ueransim_ue_linked_gnb")) {
          newRequiredFields[Object.keys(newRequiredFields).length] = "one_ueransim_ue_linked_gnb";
        }
      } else {
        // If the condition is not met, remove it from requiredFields
        newRequiredFields = Object.fromEntries(
          Object.entries(newRequiredFields).filter(([_, value]) => value !== "one_ueransim_ue_linked_gnb")
        );
      }
  
      return JSON.stringify(prevState) !== JSON.stringify(newRequiredFields) ? newRequiredFields : prevState;
    });
  }, [formValues]);
  
  // **useEffect for calling onChange  only when requiredFields change**
  useEffect(() => {
    onChange(id, "required", Object.values(requiredFields));
  }, [requiredFields, id, onChange]);
  
  

  const handleCheckboxChange = (event, key, network) => {
    const updatedNetworks = event.target.checked
      ? [...formValues[key], network] // If selected, add it to the list
      : formValues[key].filter((n) => n !== network); // If not selected, remove it from the list
  
    // Update the form values with the updated networks
    setFormValues((prevState) => ({
      ...prevState,
      [key]: updatedNetworks,
    }));
  
    // Call onChange to update the state in the parent component with the updated networks
    onChange(id, key, updatedNetworks);
  };

  const prevListRef2 = useRef();
  const prevListRef3 = useRef();
  useEffect(() => {
    if (prevListRef2.current?.length !== list2.length) {
      // Do the update only if list changes
      if (list2.length === 0 && formValues['one_ueransim_gnb_linked_open5gs'] !== "") {
        onChange(id, 'one_ueransim_gnb_linked_open5gs', "");
      }
    }
    prevListRef2.current = list2;  // Update the reference
    if (prevListRef3.current?.length !== list3.length) {
      // Do the update only if list changes
      if (list3.length === 0 && formValues['one_ueransim_ue_linked_gnb'] !== "") {
        onChange(id, 'one_ueransim_ue_linked_gnb', "");
      }
    }
    prevListRef3.current = list3
  }, [list2, formValues, onChange, id, list3]);

  const handleSelectChange2 = (event, key) => {
    const { name, value } = event.target;
    setFormValues((prevState) => ({
      ...prevState,
      [key]: value,
    }));
    // If the selected option disappears from the list (i.e., the option is no longer available)
    if (!list2.includes(value)) {
      // Here we update the state of the parent component to reflect the change
      onChange(id, key, "");  // Send an empty or null value to the parent component to indicate that the selection was removed
    } else {
      // If the option is still available, we update the value normally
      onChange(id, key, value);
    }
    
    // Field validation
    if (Object.values(requiredFields).includes(name)) {
      if (value.trim() === "") {
        setErrorMessages((prevState) => ({
          ...prevState,
          [name]: `${name} cannot be empty.`,
        }));
      } else {
        setErrorMessages((prevState) => {
          const newState = { ...prevState };
          delete newState[name]; // Delete the error message if the field is not empty
          return newState;
        });
      }
    }
  };

  const handleSelectChange3 = (event, key) => {
    const { name, value } = event.target;
    setFormValues((prevState) => ({
      ...prevState,
      [key]: value,
    }));
    // If the selected option disappears from the list (i.e., the option is no longer available)
    if (!list3.includes(value)) {
      // Here we update the state of the parent component to reflect the change
      onChange(id, key, "");  // Send an empty or null value to the parent component to indicate that the selection was removed
    } else {
      // If the option is still available, we update the value normally
      onChange(id, key, value);
    }
    
    // Validación de campo
    if (Object.values(requiredFields).includes(name)) {
      if (value.trim() === "") {
        setErrorMessages((prevState) => ({
          ...prevState,
          [name]: `${name} cannot be empty.`,
        }));
      } else {
        setErrorMessages((prevState) => {
          const newState = { ...prevState };
          delete newState[name]; // Delete the error message if the field is not empty
          return newState;
        });
      }
    }
  };
    
  const handleChange = (event) => {
    const { name, value } = event.target;
    
    // Update the form values with the new value entered by the user
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,  // Update the value of the field
    }));

    // Call onChange to update the state in the parent component
    onChange(id, name, value);
    // Field validation
    if (Object.values(requiredFields).includes(name)) {
      if (value.trim() === "") {
        setErrorMessages((prevState) => ({
          ...prevState,
          [name]: `${name} cannot be empty.`,
        }));
      } else {
        setErrorMessages((prevState) => {
          const newState = { ...prevState };
          delete newState[name]; // Delete the error message if the field is not empty
          return newState;
        });
      }
    }

    if (name === "one_ueransim_gnb_proxy" || name === "one_ueransim_gnb_amf_address"
      || name === "one_ueransim_ue_gnbSearchList"
    ) {
      if(!isValidIPv4(value)){
        setErrorMessages((prevState) => ({
          ...prevState,
          [name]: `Invalid IP in ${name}`,
        }));
        whenError(id,name,`Invalid IP in ${name}`);
      }else {
        setErrorMessages((prevState) => {
          const newState = { ...prevState };
          delete newState[name]; // Delete the error message if the field is not empty
          return newState;
        });
        whenError(id,name,null);
      }
    }
    if (name === "one_ueransim_gnb_mcc" || name === "one_ueransim_ue_mcc") {
      if (!isValidMCC(value)) {
        setErrorMessages((prevState) => ({
          ...prevState,
          [name]: `Must be only 3 digits in ${name}`,
        }));
        whenError(id, name, `Must be only 3 digits in ${name}`);
      } else {
        setErrorMessages((prevState) => {
          const newState = { ...prevState };
          delete newState[name];
          return newState;
        });
        whenError(id, name, null);
      }
    }
    
    if (name === "one_ueransim_gnb_mnc") {
      if (!isValidMNC(value)) {
        setErrorMessages((prevState) => ({
          ...prevState,
          [name]: `Must be 2 or 3 digits in ${name}`,
        }));
        whenError(id, name, `Must be 2 or 3 digits in ${name}`);
      } else {
        setErrorMessages((prevState) => {
          const newState = { ...prevState };
          delete newState[name];
          return newState;
        });
        whenError(id, name, null);
      }
    }

    if (name === "one_ueransim_ue_mnc") {
      if (!isValidMNC2(value)) {
        setErrorMessages((prevState) => ({
          ...prevState,
          [name]: `Must be 2 digits in ${name}`,
        }));
        whenError(id, name, `Must be 2 digits in ${name}`);
      } else {
        setErrorMessages((prevState) => {
          const newState = { ...prevState };
          delete newState[name];
          return newState;
        });
        whenError(id, name, null);
      }
    }

    if (name === "one_ueransim_gnb_slices_sd" || name === "one_ueransim_ue_default_nssai_sd"
      || name === "one_ueransim_ue_configured_nssai_sd" || name === "one_ueransim_ue_session_sd"
    ) {
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
  const isValidMNC2 = (mnc) => /^\d{2}$/.test(mnc); // 2 digits
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

    if (!validateInteger(value)) {
      setErrorMessages((prevState) => ({
        ...prevState,
        [key]: `${key.replace(/_/g, " ")} must be an integer.`,
      }));
    } else {
      setErrorMessages((prevState) => {
        const newState = { ...prevState };
        delete newState[key];
        return newState;
      });
    }
  };

  // If null data, show a message indicating that the component has been added
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
          <h1 className="text-3xl font-bold">UERANSIM Added</h1>
          <p className="mt-2">The UERANSIM component has been added successfully.</p>
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
        <h1 className="text-3xl font-bold">UERANSIM Config</h1>
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
              id="name"
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
            if (key === "one_ueransim_networks") {
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
            
            if (key === "one_ueransim_gnb_linked_open5gs") {
              return (
                <div key={key} className="mb-4">
                  <label htmlFor={key} className="block text-gray-700 font-semibold">
                    {key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}:
                  </label>
                  <select
                    id={key}
                    name={key}
                    value={formValues[key] || ""}
                    onChange={(e) => handleSelectChange2(e, key)}
                    className="w-full border border-gray-300 rounded-md p-2 mt-1"
                  >
                    <option disabled value="">Select an option</option>
                    {list2 && list2.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <small className="block mt-1 text-gray-500">
                  {list2.length === 0 || list2 === ""
                    ? "Create news Open5GS to be able to select"
                    : field.description
                  }
                </small>
                </div>
              );
            }
            //TODO IT LINK ITSELF , Dont  know if it is correct
            if (key === "one_ueransim_ue_linked_gnb") {
              return (
                <div key={key} className="mb-4">
                  <label htmlFor={key} className="block text-gray-700 font-semibold">
                    {key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}:
                  </label>
                  <select
                    id={key}
                    name={key}
                    value={formValues[key] || ""}
                    onChange={(e) => handleSelectChange3(e, key)}
                    className="w-full border border-gray-300 rounded-md p-2 mt-1"
                  >
                    <option disabled value="">Select an option</option>
                    {list3 && list3.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <small className="block mt-1 text-gray-500">
                  {list3.length === 0 || list3 === ""
                    ? "Create news Ueransims to be able to select"
                    : field.description
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

export default Ueransim;
