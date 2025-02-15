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
      const response = await axios.get(`${url}/tnlcm/library/components/vm_kvm`, {
        headers: {
          Authorization: bearerJwt,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      alert(`Error fetching data for vm_kvm:`, error);
      return null;
    }
  }
  return null;
};

const VmKvm = ({ id, removeComponent, onChange,list }) => {
  const [data, setData] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [errorMessages, setErrorMessages] = useState({});
  const [requiredFields, setRequiredFields] = useState({});

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchData();
      if (result) {
        setData(result.component_input);
        const initialValues = {};
        const required = [];  // Para almacenar los campos obligatorios
        for (const key in result.component_input) {
          const field = result.component_input[key];
          
          // No asignar valor por defecto si el campo es 'one_ks8500runner_networks'
          if (key !== "one_vm_kvm_networks") {
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
        // Llamar a onChange para pasar los valores iniciales al componente principal
        for (const key in initialValues) {
          onChange(id, key, initialValues[key]);
        }
      }
    };
    loadData();
  }, [id, onChange]);

  useEffect(() => {
        // Asegúrate de que "one_vm_kvm_networks" sea un array, incluso si no está inicializado
        const networks = Array.isArray(formValues["one_vm_kvm_networks"])
          ? formValues["one_vm_kvm_networks"]
          : [];
      
        // Filtrar las redes seleccionadas que aún están en la lista
        const validNetworks = networks.filter((network) => list.includes(network));
      
        // Si las redes válidas han cambiado, actualiza los valores del formulario
        if (validNetworks.length !== networks.length) {
          setFormValues((prevState) => ({
            ...prevState,
            "one_vm_kvm_networks": validNetworks,  // Actualiza el estado de las redes seleccionadas
          }));
      
          // Llama a onChange para actualizar el estado en el componente principal
          onChange(id, "one_vm_kvm_networks", validNetworks);
        }
      }, [list,formValues,id,onChange]);  // Dependencia de `list`

      const handleCheckboxChange = (event, key, network) => {
        const updatedNetworks = event.target.checked
          ? [...formValues[key], network] // Si está seleccionado, agrega la red
          : formValues[key].filter((n) => n !== network); // Si no está seleccionado, la elimina
      
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
          <h1 className="text-3xl font-bold">VM_KVM Added</h1>
          <p className="mt-2">The VM_KVM component has been added successfully.</p>
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
        <h1 className="text-3xl font-bold">VM KVM Config</h1>
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
            if (key === "one_vm_kvm_networks") {
              return (
                <div key={key} className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">
                  {key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}:
                  </label>
                  {list.map((network, index) => (
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
                  {list.length === 0 || list === ""
                    ? "Create news vnets or tn_vxlan to be able to select"
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

export default VmKvm;
