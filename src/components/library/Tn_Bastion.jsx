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
      const response = await axios.get(`${url}/tnlcm/library/components/tn_bastion`, {
        headers: {
          Authorization: bearerJwt,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      alert(`Error fetching data for tn_bastion:`, error);
      return null;
    }
  }
  return null;
};

const TnBastion = ({ id, removeComponent, onChange }) => {
  const [data, setData] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [errorMessages, setErrorMessages] = useState({});

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchData();
      if (result) {
        setData(result.component_input);
        const initialValues = {};
        for (const key in result.component_input) {
          initialValues[key] = result.component_input[key].default_value || "";
        }
        setFormValues(initialValues);

        // Llamamos a onChange para enviar los valores iniciales al componente principal
        for (const key in initialValues) {
          onChange(id, key, initialValues[key]);
        }
      }
    };
    loadData();
  }, [id, onChange]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Actualizamos los valores del formulario
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Llamamos a onChange para actualizar el estado en el componente principal
    onChange(id, name, value);

    // Verificar si el campo es obligatorio y si está vacío
    if (data[name]?.required_when && value.trim() === "") {
      setErrorMessages((prevState) => ({
        ...prevState,
        [name]: `${name.replace(/_/g, " ")} cannot be empty.`,
      }));
    } else {
      setErrorMessages((prevState) => {
        const newState = { ...prevState };
        delete newState[name]; // Eliminamos el mensaje de error si el campo no está vacío
        return newState;
      });
    }
  };

  // Mostrar mensaje si data es null
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
          <h1 className="text-3xl font-bold">TN_BASTION Added</h1>
          <p className="mt-2">The TN_BASTION component has been added successfully.</p>
        </header>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-6">
      {/* Encabezado con el ícono de eliminación */}
      <header className="bg-blue-500 text-white text-center p-4 rounded-md shadow-md">
        <button
          onClick={() => removeComponent(id)}
          className="flex text-red-500"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
        <h1 className="text-3xl font-bold">TN Bastion Config</h1>
        <p className="mt-2">Please fill in the fields below to configure the system</p>
      </header>

      <div className="mt-8 bg-white shadow-md rounded-lg p-6">
        <form>
          {Object.keys(data).map((key) => {
            const field = data[key];
            return (
              <div className="mb-4" key={key}>
                <label htmlFor={key} className="block text-gray-700 font-semibold">
                  {key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}:
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

export default TnBastion;
