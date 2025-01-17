import axios from "axios";
import React, { useEffect, useState } from "react";
import { getAccessTokenFromSessionStorage } from "../auxFunc/jwt.js";

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
  const [oneElcmInfluxdbUser, setOneElcmInfluxdbUser] = useState("");
  const [oneElcmInfluxdbPassword, setOneElcmInfluxdbPassword] = useState("");
  const [oneElcmInfluxdbDatabase, setOneElcmInfluxdbDatabase] = useState("");
  const [oneElcmGrafanaPassword, setOneElcmGrafanaPassword] = useState("");


  useEffect(() => {
    const loadData = async () => {
      const result = await fetchData();
      if (result) {
        setData(result.component_input);
        setOneElcmInfluxdbUser(result.component_input.one_elcm_influxdb_user.default_value);
        setOneElcmInfluxdbPassword(result.component_input.one_elcm_influxdb_password.default_value);
        setOneElcmInfluxdbDatabase(result.component_input.one_elcm_influxdb_database.default_value);
        setOneElcmGrafanaPassword(result.component_input.one_elcm_grafana_password.default_value);
      }
    };
    loadData();
  }, []);

  const handleChange = (setter) => (event) => {
    setter(event.target.value);
  };

  if (!data) {
    return(
        <div className="flex justify-center items-center min-h-screen">
        <img src="loading.gif" alt="Loading..." />
        </div>
      );
  }

  return (
    <div className="bg-gray-100 p-6">
      <header className="bg-blue-500 text-white text-center p-4 rounded-md shadow-md">
        <h1 className="text-3xl font-bold">ELCM  Config</h1>
        <p className="mt-2">Please fill in the fields below to configure the system</p>
      </header>

      <div className="mt-8 bg-white shadow-md rounded-lg p-6">
        <form>
          {[ 
            { id: "one_elcm_influxdb_user", value: oneElcmInfluxdbUser, setter: setOneElcmInfluxdbUser, description: data.one_elcm_influxdb_user.description },
            { id: "one_elcm_influxdb_password", value: oneElcmInfluxdbPassword, setter: setOneElcmInfluxdbPassword, description: data.one_elcm_influxdb_password.description },
            { id: "one_elcm_influxdb_database", value: oneElcmInfluxdbDatabase, setter: setOneElcmInfluxdbDatabase, description: data.one_elcm_influxdb_database.description },
            { id: "one_elcm_grafana_password", value: oneElcmGrafanaPassword, setter: setOneElcmGrafanaPassword, description: data.one_elcm_grafana_password.description },
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
        </form>
      </div>
    </div>
  );
};

export default Elcm;
