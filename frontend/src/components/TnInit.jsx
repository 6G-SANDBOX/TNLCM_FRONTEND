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
      return response.data;
    } catch (error) {
      alert(`Error al obtener datos para tn_init:`, error);
      return null;
    }
  }
  return null;
};

const TnInit = () => {
  const [data, setData] = useState(null);
  const [oneVxlanAddressSize, setOneVxlanAddressSize] = useState("");
  const [oneVxlanDns, setOneVxlanDns] = useState("");
  const [oneVxlanFirstIp, setOneVxlanFirstIp] = useState("");
  const [oneVxlanGw, setOneVxlanGw] = useState("");
  const [oneVxlanNetmask, setOneVxlanNetmask] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchData();
      if (result) {
        setData(result.component_input);
        setOneVxlanAddressSize(result.component_input.one_vxlan_address_size.default_value);
        setOneVxlanDns(result.component_input.one_vxlan_dns.default_value);
        setOneVxlanFirstIp(result.component_input.one_vxlan_first_ip.default_value);
        setOneVxlanGw(result.component_input.one_vxlan_gw.default_value);
        setOneVxlanNetmask(result.component_input.one_vxlan_netmask.default_value);
      }
    };
    loadData();
  }, []);

  const handleChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const validateInteger = (value) => {
    return Number.isInteger(Number(value));
  };

  const handleChangeOVAS = (event) => {
    const value = event.target.value;
    setOneVxlanAddressSize(value);
    if (!validateInteger(value)) {
      setErrorMessage("El valor debe ser un número entero en el campo: one_vxlan_address_size");
    } else {
      setErrorMessage("");
    }
  };

  if (!data) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="bg-gray-100  p-6">
      <header className="bg-blue-500 text-white text-center p-4 rounded-md shadow-md">
        <h1 className="text-3xl font-bold">TN Init Config</h1>
        <p className="mt-2">Please fill in the fields below to configure the system</p>
      </header>

      <div className="mt-8 bg-white shadow-md rounded-lg p-6">
        <form>
          <div className="mb-4">
            <label htmlFor="one_vxlan_address_size" className="block text-gray-700 font-semibold">
              one_vxlan_address_size:
            </label>
            <input
              type="text"
              id="one_vxlan_address_size"
              value={oneVxlanAddressSize}
              onChange={handleChangeOVAS}
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
            />
            <small className="block mt-1 text-gray-500">
              {data.one_vxlan_address_size.description}
            </small>
          </div>

          {[
            { id: "one_vxlan_dns", value: oneVxlanDns, setter: setOneVxlanDns, description: data.one_vxlan_dns.description },
            { id: "one_vxlan_first_ip", value: oneVxlanFirstIp, setter: setOneVxlanFirstIp, description: data.one_vxlan_first_ip.description },
            { id: "one_vxlan_gw", value: oneVxlanGw, setter: setOneVxlanGw, description: data.one_vxlan_gw.description },
            { id: "one_vxlan_netmask", value: oneVxlanNetmask, setter: setOneVxlanNetmask, description: data.one_vxlan_netmask.description },
          ].map((field) => (
            <div key={field.id} className="mb-4">
              <label htmlFor={field.id} className="block text-gray-700 font-semibold">
                {field.id}:
              </label>
              <input
                type="text"
                id={field.id}
                value={field.value}
                onChange={handleChange(field.setter)}
                className="w-full border border-gray-300 rounded-md p-2 mt-1"
              />
              <small className="block mt-1 text-gray-500">{field.description}</small>
            </div>
          ))}

          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default TnInit;
