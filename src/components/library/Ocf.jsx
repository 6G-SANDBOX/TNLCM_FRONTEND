import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { getComponent } from "../../auxFunc/api";

const Ocf = ({ id, removeComponent, onChange, list, whenError, defaultValues, name, request }) => {
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
        // call onChange to send initial values to parent component
        for (const key in initialValues) {
          onChange(id, key, initialValues[key]);
        }
      }
    };
    loadData();
  }, [id, onChange, defaultValues, name, request]);

  const prevListRef = useRef();
    useEffect(() => {
      if (prevListRef.current?.length !== list.length) {
        // Only update the form value if the list has changed
        if (list.length === 0 && formValues['ocf_one_oneKE'] !== "") {
          onChange(id, 'ocf_one_oneKE', "");
        }
      }
      prevListRef.current = list;  // Update the reference
    }, [list, formValues, onChange, id]);

  const handleSelectChange = (event, key) => {
    const { name, value } = event.target;
    setFormValues((prevState) => ({
      ...prevState,
      [key]: value,
    }));
    // If the option is not available, we update the state of the parent component to reflect the change
    if (!list.includes(value)) {
      // Here we send an empty string to the parent component to indicate that the selection was removed
      onChange(id, key, "");  // Send empty string to parent component
    } else {
      // If the option is available, we update the state of the parent component to reflect the change
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
      [name]: value,  // Update the value of the field
    }));

    // Call the parent component to update the state with the new value
    onChange(id, name, value);

    // field validation
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
    if (name === "ocf_any_repo"){
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

  const validateInteger = (value) => {
    return Number.isInteger(Number(value));
  };

  const handleIntegerValidation = (event, key) => {
    const value = event.target.value;
    setFormValues((prevState) => ({
      ...prevState,
      [key]: value,
    }));

    // Validate integer
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

  // If no data is returned from the API, we display a message indicating that the component was added successfully
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
          <h1 className="text-3xl font-bold">OCF Added</h1>
          <p className="mt-2">The OCF component has been added successfully.</p>
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
        <h1 className="text-3xl font-bold">OCF Config</h1>
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
            if (key === "ocf_one_oneKE"){
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

export default Ocf;
