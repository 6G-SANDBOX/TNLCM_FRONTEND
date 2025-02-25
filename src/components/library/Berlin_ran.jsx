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
      const response = await axios.get(`${url}/tnlcm/library/components/berlin_ran`, {
        headers: {
          Authorization: bearerJwt,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      alert(`Error fetching data for berlin_ran:`, error);
      return null;
    }
  }
  return null;
};

const BerlinRan = ({ id, removeComponent, onChange, list, list2, whenError }) => {
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
        // Call onChange to send initial values to parent component
        for (const key in initialValues) {
          onChange(id, key, initialValues[key]);
        }
      }
    };
    loadData();
  }, [id, onChange]);

  // Make sure the list of oneKEs is updated before updating the form value
  const prevListRef = useRef();
  const prevListRef2 = useRef();
  useEffect(() => {
    if (prevListRef.current?.length !== list.length) {
      // Only update the form value if the list of oneKEs has changed
      if (list.length === 0 && formValues['berlin_ran_one_oneKE'] !== "") {
        onChange(id, 'berlin_ran_one_oneKE', "");
      }
    }
    prevListRef.current = list;  // Save the list for the next render

    if (prevListRef2.current?.length !== list2.length) {
        // Do the update only if list changes
        if (list2.length === 0 && formValues['berlin_ran_one_linked_open5g'] !== "") {
          onChange(id, 'berlin_ran_one_linked_open5g', "");
        }
      }
      prevListRef2.current = list2
  }, [list, list2, formValues, onChange, id]);
  
  


  const handleSelectChange = (event, key) => {
    const { name, value } = event.target;
    setFormValues((prevState) => ({
      ...prevState,
      [key]: value,
    }));
    // If the selected option is not available, we update the state of the parent component to reflect the change
    if (!list.includes(value)) {
      onChange(id, key, "");  // We send an empty string to the parent component
    } else {
      // If the selected option is available, we update the state of the parent component to reflect the change
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

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Update the form values with the user input
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,  // Update the value of the field
    }));

    // call the parent component to update the state
    onChange(id, name, value);

    // Validación de campo
    if (requiredFields.includes(name)) {
      if (value.trim() === "") {
        setErrorMessages((prevState) => ({
          ...prevState,
          [name]: `${name} cannot be empty.`,
        }));
      } else {
        setErrorMessages((prevState) => {
          const newState = { ...prevState };
          delete newState[name]; // Delete error message if the field is not empty
          return newState;
        });
      }
    }
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

    // Validate the field
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

  // Show a message if the component has been added successfully
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
          <h1 className="text-3xl font-bold">BERLIN_RAN Added</h1>
          <p className="mt-2">The BERLIN_RAN component has been added successfully.</p>
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
        <h1 className="text-3xl font-bold">BERLIN_RAN Config</h1>
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
            if (key === "berlin_ran_one_oneKE") {
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
            if (key === "berlin_ran_one_linked_open5g") {
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
                        {list && list.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                        ))}
                    </select>
                    <small className="block mt-1 text-gray-500">
                    {list.length === 0 || list === ""
                        ? "Create news Open5gs to be able to select"
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

export default BerlinRan;
