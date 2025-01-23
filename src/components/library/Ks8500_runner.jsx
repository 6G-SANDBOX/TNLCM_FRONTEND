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
      const response = await axios.get(`${url}/tnlcm/library/components/ks8500_runner`, {
        headers: {
          Authorization: bearerJwt,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      alert(`Error fetching data for ks8500_runner:`, error);
      return null;
    }
  }
  return null;
};

const Ks8500Runner = ({ id, removeComponent, onChange, list }) => {
  const [data, setData] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [errorMessages, setErrorMessages] = useState({});

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchData();
      if (result) {
        setData(result.component_input);
        // Inicializa los valores del formulario con los valores predeterminados de la API
        const initialValues = {};
        for (const key in result.component_input) {
          const field = result.component_input[key];
          initialValues[key] = field.default_value || "";
        }
        // Agregar el campo 'name' con un valor inicial vacío
        initialValues['name'] = '';
        setFormValues(initialValues);
        // Llama a onChange para enviar los valores predeterminados
        for (const key in initialValues) {
          onChange(id, key, initialValues[key]); // Envía los valores predeterminados al componente principal
        }
      }
    };
    loadData();
  }, [id, onChange,]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Actualiza los valores del formulario con el valor ingresado por el usuario
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,  // Actualiza el campo con el valor ingresado por el usuario
    }));

    // Llama a onChange para actualizar el estado en el componente principal con el valor modificado
    onChange(id, name, value);

    // Validación de campo
    if (data[name]?.required_when || name === 'name') { // Ver ifica si el campo es obligatorio (incluyendo 'name')
      if (value.trim() === "") {
        setErrorMessages((prevState) => ({
          ...prevState,
          [name]: `${name} cannot be empty.`,
        }));
      } else {
        setErrorMessages((prevState) => {
          const newState = { ...prevState };
          delete newState[name]; // Elimina el mensaje de error si el campo no está vacío
          return newState;
        });
      }
    }
  };


  // Muestra el mensaje de éxito si data es null
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
          <h1 className="text-3xl font-bold">KS8500_RUNNER Added</h1>
          <p className="mt-2">The KS8500_RUNNER component has been added successfully.</p>
        </header>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-6 relative">
      <header className="bg-blue-500 text-white text-center p-4 rounded-md shadow-md">
        <button
          onClick={() => removeComponent(id)}
          className="flex text-red-500"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
        <h1 className="text-3xl font-bold">KS8500 Runner Configuration</h1>
        <p className="mt-2">Please fill in the fields below to configure the system</p>
      </header>

      <div className="mt-8 bg-white shadow-md rounded-lg p-6">
        <form>
           {/* Campo adicional 'name' */}
           <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-semibold">
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formValues.name || ""}  // Asegura que 'name' esté correctamente ligado al estado
              onChange={handleChange}  // Llama a handleChange para actualizar el valor
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
            />
            {errorMessages.name && (
              <small className="block mt-1 text-red-500">{errorMessages.name}</small>
            )}
          </div>
          
          {Object.keys(data).map((key) => {
            const field = data[key];
            if (key === "one_ks8500runner_networks") {
              // Sincroniza las opciones seleccionadas con las actuales de la lista
              const validSelectedNetworks =
                formValues[key]?.filter((n) => list.includes(n)) || [];
            
              // Si las redes válidas han cambiado, actualiza el estado
              if (validSelectedNetworks.length !== (formValues[key]?.length || 0)) {
                setFormValues((prevState) => ({
                  ...prevState,
                  [key]: validSelectedNetworks,
                }));
            
                // Notifica el cambio al componente padre
                onChange(id, key, validSelectedNetworks);
              }
            
              return (
                <div key={key} className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Select Networks:
                  </label>
                  {list.map((network, index) => (
                    <div key={index} className="flex items-center mb-1">
                      <input
                        type="checkbox"
                        id={`${key}_${index}`}
                        name={key}
                        value={network}
                        checked={formValues[key]?.includes(network) || false}
                        onChange={(event) => {
                          const updatedNetworks = event.target.checked
                            ? [...validSelectedNetworks, network]
                            : validSelectedNetworks.filter((n) => n !== network);
            
                          setFormValues((prevState) => ({
                            ...prevState,
                            [key]: updatedNetworks,
                          }));
            
                          onChange(id, key, updatedNetworks);
                        }}
                        className="mr-2"
                      />
                      <label htmlFor={`${key}_${index}`} className="text-gray-700">
                        {network}
                      </label>
                    </div>
                  ))}
                  <small className="block mt-1 text-gray-500">
                    Select one or more networks to include.
                  </small>
                </div>
              );
            }
            
            
            

            if (key === "ks8500runner_special_action") {
              return (
                <div key={key} className="mb-4">
                  <label htmlFor={key} className="block text-gray-700 font-semibold">
                    {key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}:
                  </label>
                  <select
                    id={key}
                    name={key}
                    value={formValues[key]}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2 mt-1"
                  >
                    <option value="none">None</option>
                    <option value="delete_runner_data">Delete Runner Data</option>
                  </select>
                  <small className="block mt-1 text-gray-500">{field.description}</small>
                </div>
              );
            }

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
                <small className="block mt-1 text-gray-500">{field.description}</small>
                {errorMessages[key] && <p className="text-red-500">{errorMessages[key]}</p>}
              </div>
            );
          })}
        </form>
      </div>
    </div>
  );
};

export default Ks8500Runner;
