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
      const response = await axios.get(`${url}/tnlcm/library/components/tsn`, {
        headers: {
          Authorization: bearerJwt,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      alert(`Error fetching data for tsn:`, error);
      return null;
    }
  }
  return null;
};

const Tsn = ({ id, removeComponent, onChange }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchData();
      if (result) {
        setData(result.component_input);

        // Initial values for the form
        const initialValues = {};
        for (const key in result.component_input) {
          initialValues[key] = result.component_input[key].default_value || "";
        }

        // call onChange to update the state in the parent component with the initial values
        for (const key in initialValues) {
          onChange(id, key, initialValues[key]);
        }
      } else {
        setData(null); // If there is no data due to no fields put it into null
      }
    };
    loadData();
  }, [id, onChange]);


  // if there is no data, return a message
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
          <h1 className="text-3xl font-bold">TSN Added</h1>
          <p className="mt-2">The TSN component has been added successfully.</p>
        </header>
      </div>
    );
  }

};

export default Tsn;
