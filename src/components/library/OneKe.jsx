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

const OneKe = ({ id, removeComponent, onChange, list1, list2 }) => {
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
        // Inicializamos el estado formValues con los valores predeterminados de los campos.
        const initialValues = {};
        for (const key in result.component_input) {
          const field = result.component_input[key];
          //TODO ME MARCA POR DEFECTOTN_VXLAN EN EXTERNAL
          //TODO PROBAR QUE FUNCIONA BIEN
          // No asignar valor por defecto si el campo es 'one_oneKE_external_vnet o one_oneKE_internal_vnet '
          if (key !== "one_oneKE_external_vnet" || key !== "one_oneKE_internal_vnet") {
            initialValues[key] = field.default_value || "";
          } else {
            initialValues[key] ="";
          }
          
          if (field.required_when) {
            required.push(key);
          }
        }
        // Agregar el campo 'name' con un valor inicial vacío
        required.push("name");
        initialValues['name'] = '';
        initialValues['required']=required;
        setFormValues(initialValues);
        setRequiredFields(required);
        // Llamamos a onChange para enviar los valores iniciales al componente principal
        for (const key in initialValues) {
          onChange(id, key, initialValues[key]);
        }
      }
    };
    loadData();
  }, [id, onChange]);

  useEffect(() => {
    // Asegúrate de que "one_loadcore_agent_networks" sea un array, incluso si no está inicializado
    const networks1 = Array.isArray(formValues["one_oneKE_external_vnet"])
      ? formValues["one_oneKE_external_vnet"]
      : [];
  
    // Filtrar las redes seleccionadas que aún están en la lista
    const validNetworks1 = networks1.filter((network) => list1.includes(network));
  
    // Si las redes válidas han cambiado, actualiza los valores del formulario
    if (validNetworks1.length !== networks1.length) {
      setFormValues((prevState) => ({
        ...prevState,
        "one_oneKE_external_vnet": validNetworks1,  // Actualiza el estado de las redes seleccionadas
      }));
  
      // Llama a onChange para actualizar el estado en el componente principal
      onChange(id, "one_oneKE_external_vnet", validNetworks1);
    }

    const networks2 = Array.isArray(formValues["one_oneKE_internal_vnet"])
      ? formValues["one_oneKE_internal_vnet"]
      : [];
    const validNetworks2 =networks2.filter((network) => list2.includes(network));
    if (validNetworks2.length !== networks2.length) {
      setFormValues((prevState) => ({
        ...prevState,
        "one_oneKE_internal_vnet": validNetworks2,  // Actualiza el estado de las redes seleccionadas
      }));
  
      // Llama a onChange para actualizar el estado en el componente principal
      onChange(id, "one_oneKE_internal_vnet", validNetworks2);
    }

  }, [list1,list2,formValues,id,onChange]);  // Dependencia de `list`

  const handleCheckboxChange = (event, key, network) => {
    // Asegúrate de que formValues[key] sea un arreglo antes de intentar usar filter
    const currentValue = Array.isArray(formValues[key]) ? formValues[key] : [];

    const updatedNetworks = event.target.checked
    ? [...currentValue, network] // Si está seleccionado, agrega la red
    : currentValue.filter((n) => n !== network); // Si no está seleccionado, la elimina

    // Actualiza los valores del formulario
    setFormValues((prevState) => ({
      ...prevState,
      [key]: updatedNetworks,
    }));
  
    // Llama a onChange para actualizar el estado en el componente principal
    onChange(id, key, updatedNetworks);
  };

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
    if (requiredFields.includes(name)) {
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

  const validateInteger = (value) => {
    return Number.isInteger(Number(value));
  };

  const handleIntegerValidation = (event, key) => {
    const value = event.target.value;
    setFormValues((prevState) => ({
      ...prevState,
      [key]: value,
    }));

    // Validar si el valor es un número entero
    if (!validateInteger(value)) {
      setErrorMessages((prevState) => ({
        ...prevState,
        [key]: `${key.replace(/_/g, " ")} must be an integer.`,
      }));
    } else {
      setErrorMessages((prevState) => {
        const newState = { ...prevState };
        delete newState[key]; // Eliminar mensaje de error si es un número entero
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
          <h1 className="text-3xl font-bold">ONE_KE Added</h1>
          <p className="mt-2">The ONE_KE component has been added successfully.</p>
        </header>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-6">
      {/* Encabezado con botón de eliminación */}
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
           {/* Campo adicional 'name' */}
           <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-semibold">
              Name:
            </label>
            <input
              type="text"
              id={`name-${id}`}
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
                    ? "Create news vnets or txlan to be able to select"
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

                {/* Condicional para renderizar un input o select dependiendo de si hay "choices" */}
                {field.choices ? (
                  <select
                    id={key}
                    name={key}
                    value={formValues[key] || ""}
                    onChange={(event) => handleChange(event)} // Usar handleChange para actualizar el valor
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
                        handleIntegerValidation(event, key); // Validación para campos de tipo entero
                      } else {
                        handleChange(event); // Para otros tipos de campos
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

export default OneKe;
