import axios from "axios";
import React, { useEffect, useState } from "react";
import { getAccessTokenFromSessionStorage } from "../auxFunc/jwt.js";

const fetchData = async () => {
  const access_token = await getAccessTokenFromSessionStorage();
  if (access_token) {
    const url = process.env.REACT_APP_ENDPOINT;
    const bearerJwt = `Bearer ${access_token}`;

    try {
      const response = await axios.get(`${url}/tnlcm/library/components/ks8500_runner_init`, {
        headers: {
          Authorization: bearerJwt,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      alert(`Error al obtener datos para ks8500_runner_init:`, error);
      return null;
    }
  }
  return null;
};

const Ks8500Runner = () => {
  const [data, setData] = useState(null);
  const [oneKs8500runnerNetworks, setOneKs8500runnerNetworks] = useState([]);
  const [ks8500runnerRegistrationToken, setKs8500runnerRegistrationToken] = useState("");
  const [ks8500runnerName, setKs8500runnerName] = useState("");
  const [ks8500runnerBackendUrl, setKs8500runnerBackendUrl] = useState("");
  const [ks8500runnerSpecialAction, setKs8500runnerSpecialAction] = useState("none");

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchData();
      if (result) {
        setData(result.component_input);
        setOneKs8500runnerNetworks(result.component_input.one_ks8500runner_networks.default_value || []);
        setKs8500runnerRegistrationToken(result.component_input.ks8500runner_registration_token.default_value);
        setKs8500runnerName(result.component_input.ks8500runner_name.default_value);
        setKs8500runnerBackendUrl(result.component_input.ks8500runner_backend_url.default_value);
        setKs8500runnerSpecialAction(result.component_input.ks8500runner_special_action.default_value || "none");
      }
    };
    loadData();
  }, []);

  const handleChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const handleNetworkChange = (event) => {
    const { value } = event.target;
    setOneKs8500runnerNetworks(value.split(','));
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
        <h1 className="text-3xl font-bold">KS8500 Runner Init Config</h1>
        <p className="mt-2">Please fill in the fields below to configure the system</p>
      </header>

      <div className="mt-8 bg-white shadow-md rounded-lg p-6">
        <form>
          <div className="mb-4">
            <label htmlFor="one_ks8500runner_networks" className="block text-gray-700 font-semibold">
              one_ks8500runner_networks (comma separated list):
            </label>
            <input
              type="text"
              id="one_ks8500runner_networks"
              value={oneKs8500runnerNetworks.join(", ")}
              onChange={handleNetworkChange}
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
            />
            <small className="block mt-1 text-gray-500">
              {data.one_ks8500runner_networks.description}
            </small>
          </div>

          <div className="mb-4">
            <label htmlFor="ks8500runner_registration_token" className="block text-gray-700 font-semibold">
              ks8500runner_registration_token:
            </label>
            <input
              type="text"
              id="ks8500runner_registration_token"
              value={ks8500runnerRegistrationToken}
              onChange={handleChange(setKs8500runnerRegistrationToken)}
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
            />
            <small className="block mt-1 text-gray-500">
              {data.ks8500runner_registration_token.description}
            </small>
          </div>

          <div className="mb-4">
            <label htmlFor="ks8500runner_name" className="block text-gray-700 font-semibold">
              ks8500runner_name:
            </label>
            <input
              type="text"
              id="ks8500runner_name"
              value={ks8500runnerName}
              onChange={handleChange(setKs8500runnerName)}
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
            />
            <small className="block mt-1 text-gray-500">
              {data.ks8500runner_name.description}
            </small>
          </div>

          <div className="mb-4">
            <label htmlFor="ks8500runner_backend_url" className="block text-gray-700 font-semibold">
              ks8500runner_backend_url:
            </label>
            <input
              type="text"
              id="ks8500runner_backend_url"
              value={ks8500runnerBackendUrl}
              onChange={handleChange(setKs8500runnerBackendUrl)}
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
            />
            <small className="block mt-1 text-gray-500">
              {data.ks8500runner_backend_url.description}
            </small>
          </div>

          <div className="mb-4">
            <label htmlFor="ks8500runner_special_action" className="block text-gray-700 font-semibold">
              ks8500runner_special_action:
            </label>
            <select
              id="ks8500runner_special_action"
              value={ks8500runnerSpecialAction}
              onChange={handleChange(setKs8500runnerSpecialAction)}
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
            >
              <option value="none">None</option>
              <option value="delete_runner_data">Delete Runner Data</option>
            </select>
            <small className="block mt-1 text-gray-500">
              {data.ks8500runner_special_action.description}
            </small>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Ks8500Runner;
