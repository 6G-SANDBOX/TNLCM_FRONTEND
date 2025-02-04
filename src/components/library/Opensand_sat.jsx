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
      const response = await axios.get(`${url}/tnlcm/library/components/opensand_sat`, {
        headers: {
          Authorization: bearerJwt,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      alert(`Error fetching data for opensand_sat:`, error);
      return null;
    }
  }
  return null;
};

const OpensandSat = ({ id, removeComponent, onChange }) => {
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
          const required = [];
          for (const key in result.component_input) {
            initialValues[key] = result.component_input[key].default_value || "";
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
          <h1 className="text-3xl font-bold">OpenSand_SAT Added</h1>
          <p className="mt-2">The OpenSand_SAT component has been added successfully.</p>
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
      </form>
    </div>
    </div>
    );
  }
};

export default OpensandSat;
