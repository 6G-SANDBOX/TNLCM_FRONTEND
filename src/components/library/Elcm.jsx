import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";

const Elcm = ({ id, removeComponent, onChange, defaultValues, name, request }) => {
  const [data, setData] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [errorMessages, setErrorMessages] = useState({});
  const [requiredFields, setRequiredFields] = useState({});
  const hasFetched = useRef(false);
  // UseEffect to fetch data from the API
  useEffect(() => {
    const loadData = async () => {
      if (hasFetched.current) return;
      hasFetched.current = true;
      let result= null;
      result = await request;
      if (!result) {
        hasFetched.current = false;
        return;
      }
      result = await request;
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
        
        setRequiredFields(required);  // Set the required fields
        setFormValues(initialValues); // Put the default values in the form
        // Call onChange to send the default values to the parent component
        for (const key in initialValues) {
          onChange(id, key, initialValues[key]);
        }
        
      }
    };
    loadData();
  }, [id, onChange, defaultValues, name, request]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Update the form values with the new value
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,  // Update the value for the field
    }));

    // Call onChange to send the new value to the parent component
    onChange(id, name, value);

    // Update the error messages
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
  };

  // If null, show a message that the component has been added
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
          <h1 className="text-3xl font-bold">ELCM Added</h1>
          <p className="mt-2">The ELCM component has been added successfully.</p>
        </header>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-6 relative">
      <header className="bg-blue-500 text-white text-center p-4 rounded-md shadow-md">
        <button
          onClick={() => removeComponent(id)}
          className="absolute flex flex-col text-red-500"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
        <h1 className="text-3xl font-bold">ELCM Configuration</h1>
        <p className="mt-2">Please fill in the fields below to configure the system</p>
      </header>

      <div className="mt-8 bg-white shadow-md rounded-lg p-6">
        <form>
           {/* Additional 'name' */}
           <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-semibold">
              Name:
            </label>
            <input
              type="text"
              id={`name-${id}`}
              name="name"
              value={formValues.name || ""}  // Make the input controlled
              onChange={handleChange}  // Call handleChange to update the value
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
            />
            {errorMessages.name && (
              <small className="block mt-1 text-red-500">{errorMessages.name}</small>
            )}
          </div>
          {/* Render the api fields */}
          {data && Object.keys(data).map((key) => {
            const field = data[key];
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

export default Elcm;
