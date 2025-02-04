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
      const response = await axios.get(`${url}/tnlcm/library/components/ueransim`, {
        headers: {
          Authorization: bearerJwt,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      alert(`Error fetching data for ueransim:`, error);
      return null;
    }
  }
  return null;
};
const Ueransim = ({ id, removeComponent, onChange, list1, list2, list3, whenError }) => {
  const [data, setData] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [errorMessages, setErrorMessages] = useState({});
  const [requiredFields, setRequiredFields] = useState({});
  //TODO ERRORS HANDLING
  useEffect(() => {
    const loadData = async () => {
      const result = await fetchData();
      if (result) {
        setData(result.component_input);
        const initialValues = {};
        const required = [];
        for (const key in result.component_input) {
          const field = result.component_input[key];
          
          // No asignar valor por defecto si el campo es 'one_ks8500runner_networks'
          if (key !== "one_ueransim_networks" && key !== "one_ueransim_gnb_linked_open5gs"  && key !== "one_ueransim_ue_linked_gnb") {
            initialValues[key] = field.default_value || "";
          } else {
            initialValues[key] ="";
          }
          if (field.required_when ===  true) {
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
      } else {
        setData(null);  // Si no hay datos, establecer data como null
      }
    };
    loadData();
  }, [id, onChange]);

  useEffect(() => {
    // Asegúrate de que "one_ueransim_networks" sea un array, incluso si no está inicializado
    const networks = Array.isArray(formValues["one_ueransim_networks"])
      ? formValues["one_ueransim_networks"]
      : [];
  
    // Filtrar las redes seleccionadas que aún están en la lista
    const validNetworks = networks.filter((network) => list1.includes(network));
  
    // Si las redes válidas han cambiado, actualiza los valores del formulario
    if (validNetworks.length !== networks.length) {
      setFormValues((prevState) => ({
        ...prevState,
        "one_ueransim_networks": validNetworks,  // Actualiza el estado de las redes seleccionadas
      }));
  
      // Llama a onChange para actualizar el estado en el componente principal
      onChange(id, "one_ueransim_networks", validNetworks);
    }
  }, [list1,formValues,id,onChange]);  // Dependencia de `list`

  // UseEffect para manejar las requiredFields especiales
  useEffect(() => {
    setRequiredFields((prevState) => {
      let newRequiredFields = { ...prevState };
  
      // Comprobar cuando es requerido one_ueransim_gnb_linked_open5gs
      if (formValues["one_ueransim_run_gnb"] === "YES") {
        if (!Object.values(newRequiredFields).includes("one_ueransim_gnb_linked_open5gs")) {
          newRequiredFields[Object.keys(newRequiredFields).length] = "one_ueransim_gnb_linked_open5gs";
        }
      } else {
        // Si la condición ya no se cumple, eliminarlo de requiredFields
        newRequiredFields = Object.fromEntries(
          Object.entries(newRequiredFields).filter(([_, value]) => value !== "one_ueransim_gnb_linked_open5gs")
        );
      }
  
      // Comprobar cuando es requerido one_ueransim_ue_linked_gnb
      if (formValues["one_ueransim_run_gnb"] === "NO" && formValues["one_ueransim_run_ue"] === "YES") {
        if (!Object.values(newRequiredFields).includes("one_ueransim_ue_linked_gnb")) {
          newRequiredFields[Object.keys(newRequiredFields).length] = "one_ueransim_ue_linked_gnb";
        }
      } else {
        // Si la condición ya no se cumple, eliminarlo de requiredFields
        newRequiredFields = Object.fromEntries(
          Object.entries(newRequiredFields).filter(([_, value]) => value !== "one_ueransim_ue_linked_gnb")
        );
      }
  
      // Evitar actualización innecesaria
      return JSON.stringify(prevState) !== JSON.stringify(newRequiredFields) ? newRequiredFields : prevState;
    });
  }, [formValues]);
  
  // **useEffect para llamar a onChange solo cuando requiredFields cambie**
  useEffect(() => {
    onChange(id, "required", Object.values(requiredFields));
  }, [requiredFields, id, onChange]);
  
  

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

  const prevListRef2 = useRef();
  const prevListRef3 = useRef();
    useEffect(() => {
      if (prevListRef2.current?.length !== list2.length) {
        // Realizar actualización solo si list cambia
        if (list2.length === 0 && formValues['one_ueransim_gnb_linked_open5gs'] !== "") {
          onChange(id, 'one_ueransim_gnb_linked_open5gs', "");  // Enviar valor vacío
        }
      }
      prevListRef2.current = list2;  // Actualizar el valor de referencia para la próxima comparación
      
      if (prevListRef3.current?.length !== list3.length) {
        // Realizar actualización solo si list cambia
        if (list3.length === 0 && formValues['one_ueransim_ue_linked_gnb'] !== "") {
          onChange(id, 'one_ueransim_ue_linked_gnb', "");  // Enviar valor vacío
        }
      }
      prevListRef3.current = list3
    }, [list2, formValues, onChange, id, list3]);

    const handleSelectChange2 = (event, key) => {
      const { name, value } = event.target;
      setFormValues((prevState) => ({
        ...prevState,
        [key]: value,
      }));
      // Si la opción seleccionada desaparece de la lista (es decir, la opción ya no está disponible)
      if (!list2.includes(value)) {
        // Aquí actualizamos el estado del componente padre para reflejar el cambio
        onChange(id, key, "");  // Enviamos un valor vacío o nulo al componente padre para indicar que la selección fue eliminada
      } else {
        // Si la opción sigue disponible, actualizamos normalmente el valor
        onChange(id, key, value);
      }
      
      // Validación de campo
      if (Object.values(requiredFields).includes(name)) {
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

    const handleSelectChange3 = (event, key) => {
      const { name, value } = event.target;
      setFormValues((prevState) => ({
        ...prevState,
        [key]: value,
      }));
      // Si la opción seleccionada desaparece de la lista (es decir, la opción ya no está disponible)
      if (!list3.includes(value)) {
        // Aquí actualizamos el estado del componente padre para reflejar el cambio
        onChange(id, key, "");  // Enviamos un valor vacío o nulo al componente padre para indicar que la selección fue eliminada
      } else {
        // Si la opción sigue disponible, actualizamos normalmente el valor
        onChange(id, key, value);
      }
      
      // Validación de campo
      if (Object.values(requiredFields).includes(name)) {
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
    if (Object.values(requiredFields).includes(name)) {
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
          <h1 className="text-3xl font-bold">UERANSIM Added</h1>
          <p className="mt-2">The UERANSIM component has been added successfully.</p>
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
        <h1 className="text-3xl font-bold">UERANSIM Config</h1>
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
            if (key === "one_ueransim_networks") {
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
                    ? "Create news vnetsm or tn_vxlan to be able to select"
                    : "Select one or more networks to include"
                  }
                </small>
                </div>
              );
            }
            
            if (key === "one_ueransim_gnb_linked_open5gs") {
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
                    {list2 && list2.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <small className="block mt-1 text-gray-500">
                  {list2.length === 0 || list2 === ""
                    ? "Create news Open5GS to be able to select"
                    : field.description
                  }
                </small>
                </div>
              );
            }
            //TODO SE LINKEA A SI MISMO
            if (key === "one_ueransim_ue_linked_gnb") {
              return (
                <div key={key} className="mb-4">
                  <label htmlFor={key} className="block text-gray-700 font-semibold">
                    {key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}:
                  </label>
                  <select
                    id={key}
                    name={key}
                    value={formValues[key] || ""}
                    onChange={(e) => handleSelectChange3(e, key)}
                    className="w-full border border-gray-300 rounded-md p-2 mt-1"
                  >
                    <option disabled value="">Select an option</option>
                    {list3 && list3.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <small className="block mt-1 text-gray-500">
                  {list3.length === 0 || list3 === ""
                    ? "Create news Ueransims to be able to select"
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

export default Ueransim;
