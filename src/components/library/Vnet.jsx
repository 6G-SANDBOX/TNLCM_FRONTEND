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
      const response = await axios.get(`${url}/tnlcm/library/components/vnet`, {
        headers: {
          Authorization: bearerJwt,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      alert(`Error fetching data for vnet:`, error);
      return null;
    }
  }
  return null;
};

const Vnet = ({ id, removeComponent, onChange, whenError }) => {
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
        // Call onChange for each initial value
        for (const key in initialValues) {
          onChange(id, key, initialValues[key]);
        }
      }
    };
    loadData();
  }, [id, onChange]);
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
        delete newState[key]; // Delete the error message if the field is valid
        return newState;
      });
      whenError(id, key, null);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Update the form values with the user input
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Call the onChange function to update the parent state
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
          delete newState[name]; // Delete the error message if the field is not empty
          return newState;
        });
      }
    }

    if (name === "one_vnet_gw"  || name === "one_vnet_first_ip") {
      if(!isValidIPv4(value)){
        setErrorMessages((prevState) => ({
          ...prevState,
          [name]: `Invalid IP in ${name}`,
        }));
        whenError(id,name,`Invalid IP in ${name}`);
      }else {
        setErrorMessages((prevState) => {
          const newState = { ...prevState };
          delete newState[name]; // Elimina el mensaje de error si el campo no está vacío
          return newState;
        });
        whenError(id,name,null);
      }
    }

    if (name === "one_vnet_dns"){
      if(!isValidIPv4List(value)){
        setErrorMessages((prevState) => ({
          ...prevState,
          [name]: `Invalid IP list format in ${name}`,
        }));
        whenError(id,name,`Invalid IP list format in ${name}`);
      }else {
        setErrorMessages((prevState) => {
          const newState = { ...prevState };
          delete newState[name]; // Elimina el mensaje de error si el campo no está vacío
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
  
  const isValidIPv4List = (str) => {
    // Regular expression for an IPv4 address
    const ipv4Pattern =
      /^(25[0-5]|2[0-4]\d|1\d\d|\d\d|\d)\.(25[0-5]|2[0-4]\d|1\d\d|\d\d|\d)\.(25[0-5]|2[0-4]\d|1\d\d|\d\d|\d)\.(25[0-5]|2[0-4]\d|1\d\d|\d\d|\d)$/;
  
    // Split the string into a list of IPs
    const ipList = str.trim().split(/\s+/);
  
    // Check if all IPs are valid
    return ipList.every((ip) => ipv4Pattern.test(ip));
  };


  // If the data is null, show a message indicating that the component was added successfully
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
          <h1 className="text-3xl font-bold">VNET Added</h1>
          <p className="mt-2">The VNET component has been added successfully.</p>
        </header>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-6">
      {/* Header with a delete button */}
      <header className="bg-blue-500 text-white text-center p-4 rounded-md shadow-md">
        <button
          onClick={() => removeComponent(id)}
          className="flex text-red-500"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
        <h1 className="text-3xl font-bold">VNet Config</h1>
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

export default Vnet;
