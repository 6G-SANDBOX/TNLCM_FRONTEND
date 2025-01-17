import axios from "axios";
import React, { useEffect, useState } from "react";
import { getAccessTokenFromSessionStorage } from "../../auxFunc/jwt.js";

const fetchData = async () => {
  const access_token = await getAccessTokenFromSessionStorage();
  if (access_token) {
    const url = process.env.REACT_APP_ENDPOINT;
    const bearerJwt = `Bearer ${access_token}`;

    try {
      const response = await axios.get(`${url}/tnlcm/library/components/elcm`, {
        headers: {
          Authorization: bearerJwt,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      alert(`Error fetching data for elcm:`, error);
      return null;
    }
  }
  return null;
};

const Elcm = () => {
  const [data, setData] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [errorMessages, setErrorMessages] = useState({});

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchData();
      if (result) {
        setData(result.component_input);

        // Initialize form values with default values from the API
        const initialValues = {};
        for (const key in result.component_input) {
          const field = result.component_input[key];
          initialValues[key] = field.default_value || "";
        }
        setFormValues(initialValues);
      }
    };
    loadData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Update form values
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // If the field is required, validate if it's empty and show error message
    if (data[name]?.required_when && value.trim() === "") {
      setErrorMessages((prevState) => ({
        ...prevState,
        [name]: `${name} cannot be empty.`,
      }));
    } else {
      setErrorMessages((prevState) => {
        const newState = { ...prevState };
        delete newState[name]; // Remove the error message if the field is not empty
        return newState;
      });
    }
  };

  if (!data) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <img src="loading.gif" alt="Loading..." />
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-6">
      <header className="bg-blue-500 text-white text-center p-4 rounded-md shadow-md">
        <h1 className="text-3xl font-bold">ELCM Configuration</h1>
        <p className="mt-2">Please fill in the fields below to configure the system</p>
      </header>

      <div className="mt-8 bg-white shadow-md rounded-lg p-6">
        <form>
          {Object.keys(data).map((key) => {
            const field = data[key];
            return (
              <div key={key} className="mb-4">
                <label htmlFor={key} className="block text-gray-700 font-semibold">
                  {key.replace(/_/g, " ").replace(/\b\w/g, char => char.toUpperCase())}:
                </label>
                <input
                  type="text"
                  id={key}
                  name={key}
                  value={formValues[key] || ""}
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
