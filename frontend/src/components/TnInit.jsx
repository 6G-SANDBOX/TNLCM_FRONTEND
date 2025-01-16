import axios from "axios";
import React, { useEffect, useState } from "react";
import { getAccessTokenFromSessionStorage } from "../auxFunc/jwt.js";

const fetchData = async () => {
  const access_token = await getAccessTokenFromSessionStorage();
  if (access_token) {
    const url = process.env.REACT_APP_ENDPOINT;
    const bearerJwt = `Bearer ${access_token}`;

    try {
      const response = await axios.get(`${url}/tnlcm/library/components/tn_init`, {
        headers: {
          Authorization: bearerJwt,
          "Content-Type": "application/json",
        },
      });
      console.log(`Datos para tn_init:`, response.data);
      return response.data; // Retornar solo los datos que necesitamos
    } catch (error) {
      console.error(`Error al obtener datos para tn_init:`, error);
      return null;
    }
  }
  return null;
};

const TnInit = () => {
  // Estado para almacenar los datos de la API
  const [data, setData] = useState(null);
  // Estado para almacenar los valores editables
  const [oneVxlanAddressSize, setOneVxlanAddressSize] = useState("");
  const [oneVxlanDns, setOneVxlanDns] = useState("");
  const [oneVxlanFirstIp, setOneVxlanFirstIp] = useState("");
  const [oneVxlanGw, setOneVxlanGw] = useState("");
  const [oneVxlanNetmask, setOneVxlanNetmask] = useState("");
  // Estado para almacenar los mensajes de error
  const [errorMessage, setErrorMessage] = useState("");

  // Llamada a la función fetchData cuando el componente se monte
  useEffect(() => {
    const loadData = async () => {
      const result = await fetchData();
      if (result) {
        setData(result.component_input); // Guardamos los datos en el estado
        setOneVxlanAddressSize(result.component_input.one_vxlan_address_size.default_value); // Inicializamos el valor editable con el valor por defecto
        setOneVxlanDns(result.component_input.one_vxlan_dns.default_value);
        setOneVxlanFirstIp(result.component_input.one_vxlan_first_ip.default_value);
        setOneVxlanGw(result.component_input.one_vxlan_gw.default_value);
        setOneVxlanNetmask(result.component_input.one_vxlan_netmask.default_value);
      }
    };

    loadData();
  }, []); // Este useEffect se ejecuta una sola vez al montar el componente

  // Función para manejar el cambio en el campo one_vxlan_address_size
  const handleChangeOVAS = (event) => {
    const value = event.target.value;
    setOneVxlanAddressSize(value); // Actualizamos el valor editable

    // Validar si el valor es un número entero
    if (!Number.isInteger(Number(value))) {
      setErrorMessage("El valor debe ser un número entero en el campo: one_vxlan_address_size");
    } else {
      setErrorMessage(""); // Si es válido, limpiar el mensaje de error
    }
  };

  const handleChangeDNS = (event) => {
    const value = event.target.value;
    setOneVxlanDns(value); // Actualizamos el valor editable
  };

  const handleChangeFirstIp = (event) => {
    const value = event.target.value;
    setOneVxlanFirstIp(value); // Actualizamos el valor editable
  };

  const handleChangeGw = (event) => {
    const value = event.target.value;
    setOneVxlanGw(value); // Actualizamos el valor editable
  };

  const handleChangeNetmask = (event) => {
    const value = event.target.value;
    setOneVxlanNetmask(value); // Actualizamos el valor editable
  };

  if (!data) {
    // Si los datos no han sido cargados, mostramos un mensaje de carga
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h1>Formulario con los datos de tn_init</h1>

      {/* Formulario con los campos */}
      <form>
        <div>
          <label htmlFor="one_vxlan_address_size">one_vxlan_address_size:</label>
          <input
            type="text"
            id="one_vxlan_address_size"
            value={oneVxlanAddressSize} // El valor editable se vincula con el estado
            onChange={handleChangeOVAS} // Actualiza el estado cuando el usuario cambia el valor
            className="w-full border border-gray-300 rounded-md p-2 mt-1"
          />
          <small className="block mt-1 text-gray-500">
            {data.one_vxlan_address_size.description}
          </small>
        </div>

        <div>
          <label htmlFor="one_vxlan_dns">one_vxlan_dns:</label>
          <input
            type="text"
            id="one_vxlan_dns"
            value={oneVxlanDns} // El valor editable se vincula con el estado
            onChange={handleChangeDNS} // Actualiza el estado cuando el usuario cambia el valor
            className="w-full border border-gray-300 rounded-md p-2 mt-1"
          />
          <small className="block mt-1 text-gray-500">
            {data.one_vxlan_dns.description}
          </small>
        </div>

        <div>
          <label htmlFor="one_vxlan_first_ip">one_vxlan_first_ip:</label>
          <input
            type="text"
            id="one_vxlan_first_ip"
            value={oneVxlanFirstIp} // El valor editable se vincula con el estado
            onChange={handleChangeFirstIp} // Actualiza el estado cuando el usuario cambia el valor
            className="w-full border border-gray-300 rounded-md p-2 mt-1"
          />
          <small className="block mt-1 text-gray-500">
            {data.one_vxlan_first_ip.description}
          </small>
        </div>

        <div>
          <label htmlFor="one_vxlan_gw">one_vxlan_gw:</label>
          <input
            type="text"
            id="one_vxlan_gw"
            value={oneVxlanGw} // El valor editable se vincula con el estado
            onChange={handleChangeGw} // Actualiza el estado cuando el usuario cambia el valor
            className="w-full border border-gray-300 rounded-md p-2 mt-1"
          />
          <small className="block mt-1 text-gray-500">
            {data.one_vxlan_gw.description}
          </small>
        </div>

        <div>
          <label htmlFor="one_vxlan_netmask">one_vxlan_netmask:</label>
          <input
            type="text"
            id="one_vxlan_netmask"
            value={oneVxlanNetmask} // El valor editable se vincula con el estado
            onChange={handleChangeNetmask} // Actualiza el estado cuando el usuario cambia el valor
            className="w-full border border-gray-300 rounded-md p-2 mt-1"
          />
          <small className="block mt-1 text-gray-500">
            {data.one_vxlan_netmask.description}
          </small>
        </div>

        {/* Mostrar el mensaje de error si el valor no es un número entero */}
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default TnInit;
