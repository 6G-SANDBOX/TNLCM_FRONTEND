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

    const delay = Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000;
    await new Promise(resolve => setTimeout(resolve, delay));
    
    try {
      const response = await axios.get(`${url}/tnlcm/library/components/open5gs_k8s`, {
        headers: {
          Authorization: bearerJwt,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      alert(`Error fetching data for open5gs_k8s:`, error);
      return null;
    }
  }
  return null;
};

const Open5gsK8S = ({ id, removeComponent, onChange, list, whenError, defaultValues, name}) => {
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
        // call onChange to update the state in the parent component with the initial values
        for (const key in initialValues) {
          onChange(id, key, initialValues[key]);
        }
      }
    };
    loadData();
  }, [id, onChange, defaultValues, name]);

  const prevListRef = useRef();
    useEffect(() => {
      if (prevListRef.current?.length !== list.length) {
        // Update the value of the field in the parent component if the list changes
        if (list.length === 0 && formValues['one_open5gs_k8s_target'] !== "") {
          onChange(id, 'one_open5gs_k8s_target', "");
        }
      }
      prevListRef.current = list;
    }, [list, formValues, onChange, id]);

    const handleSelectChange = (event, key) => {
    const { name, value } = event.target;
    setFormValues((prevState) => ({
      ...prevState,
      [key]: value,
    }));
    // If the option is no longer available, update the state of the parent component to reflect the change
    if (!list.includes(value)) {
      onChange(id, key, "");  // Set the value to an empty string
    } else {
      // If the option is available, update the state of the parent component with the new value
      onChange(id, key, value);
    }
    
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

    if (name === "one_open5gs_k8s_upf_ip" || name === "one_open5gs_k8s_amf_ip") {
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
    if (name === "one_open5gs_k8s_mcc") {
      if (!isValidMCC(value)) {
        setErrorMessages((prevState) => ({
          ...prevState,
          [name]: `Must be only 3 digits in ${name}`,
        }));
        whenError(id, name, `Must be only 3 digits in ${name}`);
      } else if (
        ((value ?? "").replace(/"/g, "").length +
          (formValues.one_open5gs_k8s_mnc ?? "").replace(/"/g, "").length +
          (formValues.one_open5gs_k8s_msin ?? "").replace(/"/g, "").length) !== 15
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
    
    if (name === "one_open5gs_k8s_mnc") {
      if (!isValidMNC(value)) {
        setErrorMessages((prevState) => ({
          ...prevState,
          [name]: `Must be 2 or 3 digits in ${name}`,
        }));
        whenError(id, name, `Must be 2 or 3 digits in ${name}`);
      } else if (
        ((formValues.one_open5gs_k8s_mcc ?? "").replace(/"/g, "").length +
          (value ?? "").replace(/"/g, "").length +
          (formValues.one_open5gs_k8s_msin ?? "").replace(/"/g, "").length) !== 15
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
    
    if (name === "one_open5gs_k8s_msin") {
      if (!isValidMSIN(value)) {
        setErrorMessages((prevState) => ({
          ...prevState,
          [name]: `Must be 9 or 10 digits in ${name}`,
        }));
        whenError(id, name, `Must be 9 or 10 digits in ${name}`);
      } else if (
        ((formValues.one_open5gs_k8s_mcc ?? "").replace(/"/g, "").length +
          (formValues.one_open5gs_k8s_mnc ?? "").replace(/"/g, "").length +
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

    if (name === "one_open5gs_k8s_s_nssai_sd"){
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
          <h1 className="text-3xl font-bold">OPEN5GS_K8S Added</h1>
          <p className="mt-2">The OPEN5GS_K8S component has been added successfully.</p>
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
        <h1 className="text-3xl font-bold">Open5GS_k8s Config</h1>
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
            if (key === "one_open5gs_k8s_target") {
              return (
                <div key={key} className="mb-4">
                  <label htmlFor={key} className="block text-gray-700 font-semibold">
                    {key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}:
                  </label>
                  <select
                    id={key}
                    name={key}
                    value={formValues[key] || ""}
                    onChange={(e) => handleSelectChange(e, key)}
                    className="w-full border border-gray-300 rounded-md p-2 mt-1"
                  >
                    <option disabled value="">Select an option</option>
                    {list && list.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <small className="block mt-1 text-gray-500">
                  {list.length === 0 || list === ""
                    ? "Create news oneKEs to be able to select"
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

export default Open5gsK8S;
