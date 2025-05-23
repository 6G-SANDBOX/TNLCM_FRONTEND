import axios from "axios";
import { getAccessTokenFromSessionStorage } from "../auxFunc/jwt";

const sitesBranch = process.env.REACT_APP_SITES_BRANCH;
const deploymentSite = process.env.REACT_APP_DEPLOYMENT_SITE;
const libraryRef = process.env.REACT_APP_LIBRARY_REF;
const libraryValue = process.env.REACT_APP_LIBRARY_REF_VALUE;
const siteToken = process.env.REACT_APP_DEPLOYMENT_SITE_TOKEN;

export const createTrialNetwork = async (formData) => {
  let url = `${process.env.REACT_APP_TNLCM_BACKEND_API}/trial-network?validate=True`;
  const access_token = await getAccessTokenFromSessionStorage();
  const auth = `Bearer ${access_token}`;
  const response = await axios.post(url, formData, {
    headers: {
      Authorization: auth,
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export const saveTrialNetwork = async (formData) => {
  const access_token = await getAccessTokenFromSessionStorage();
  const auth = `Bearer ${access_token}`;
  let url = `${process.env.REACT_APP_TNLCM_BACKEND_API}/trial-network?validate=False`;
  const response = await axios.post(url, formData, {
    headers: {
      Authorization: auth,
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export const updateTrialNetwork = async (formData, id) => {
  const access_token = await getAccessTokenFromSessionStorage();
  const auth = `Bearer ${access_token}`;
  let url = `${process.env.REACT_APP_TNLCM_BACKEND_API}/trial-networks/${id}/update`;
  const response = await axios.put(url, formData, {
    headers: {
      Authorization: auth,
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export const getTrialNetworks = async () => {
  const access_token = await getAccessTokenFromSessionStorage();
  const auth = `Bearer ${access_token}`;
  let url = `${process.env.REACT_APP_TNLCM_BACKEND_API}/trial-networks`;
  const response = await axios.get(url, {
    headers: {
      Authorization: auth,
      "Content-Type": "application/json",
    },
  });
  return response;
};

export const getTrialNetwork = async (id) => {
  const access_token = await getAccessTokenFromSessionStorage();
  const auth = `Bearer ${access_token}`;
  let url = `${process.env.REACT_APP_TNLCM_BACKEND_API}/trial-networks/${id}`;
  const response = await axios.get(url, {
    headers: {
      Authorization: auth,
      "Content-Type": "application/json",
    },
  });
  return response;
};

export const purgeTN = async (id) => {
  const access_token = await getAccessTokenFromSessionStorage();
  const auth = `Bearer ${access_token}`;
  let url = `${process.env.REACT_APP_TNLCM_BACKEND_API}/trial-networks/${id}/purge`;
  const response = await axios.delete(url, {
    headers: {
      Authorization: auth,
      "Content-Type": "application/json",
    },
  });
  return response;
};

export const deleteTN = async (id) => {
  const access_token = await getAccessTokenFromSessionStorage();
  const auth = `Bearer ${access_token}`;
  let url = `${process.env.REACT_APP_TNLCM_BACKEND_API}/trial-networks/${id}/destroy`;
  const response = await axios.delete(url, {
    headers: {
      Authorization: auth,
      "Content-Type": "application/json",
    },
  });
  return response;
};

export const putTN = async (id) => {
  const access_token = await getAccessTokenFromSessionStorage();
  const auth = `Bearer ${access_token}`;
  let url = `${process.env.REACT_APP_TNLCM_BACKEND_API}/trial-networks/${id}/activate`;
  const response = await axios.put(
    url,
    {},
    {
      headers: {
        Authorization: auth,
        "Content-Type": "application/json",
      },
    }
  );
  return response;
};

export const getUser = async () => {
  try {
    const url = `${process.env.REACT_APP_TNLCM_BACKEND_API}/user`;
    const access_token = await getAccessTokenFromSessionStorage();
    const auth = `Bearer ${access_token}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: auth,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (err) {
    console.error(
      "Error while retrieving user info:",
      err.response?.data?.message || err.message
    );
  }
};

export const getSites = async () => {
  try {
    const url = `${process.env.REACT_APP_TNLCM_BACKEND_API}/sites/branches`;
    const access_token = await getAccessTokenFromSessionStorage();
    const auth = `Bearer ${access_token}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: auth,
        "Content-Type": "application/json",
      },
    });
    return response.data || { sites: [] };
  } catch (err) {
    console.error(
      "Error while retrieving all the sites:",
      err.response?.data?.message || err.message
    );
    return { sites: [] };
  }
};

export const getDeployments = async (deplo) => {
  try {
    const url = `${process.env.REACT_APP_TNLCM_BACKEND_API}/sites/${deplo}`;
    const access_token = await getAccessTokenFromSessionStorage();
    const auth = `Bearer ${access_token}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: auth,
        "Content-Type": "application/json",
      },
    });
    return response.data || { deployments: [] };
  } catch (err) {
    console.error(
      "Error while retrieving all the directories from the branch:",
      err.response?.data?.message || err.message
    );
    return { deployments: [] };
  }
};

export const getLibraryTypes = async () => {
  try {
    const url = `${process.env.REACT_APP_TNLCM_BACKEND_API}/library/references_types`;
    const access_token = await getAccessTokenFromSessionStorage();
    const auth = `Bearer ${access_token}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: auth,
        "Content-Type": "application/json",
      },
    });
    return response.data || { libraryTypes: [] };
  } catch (err) {
    console.error(
      "Error while retrieving all the library types:",
      err.response?.data?.message || err.message
    );
    return { libraryTypes: [] };
  }
};

export const getLibraryValues = async (type) => {
  try {
    const url = `${process.env.REACT_APP_TNLCM_BACKEND_API}/library/${type}`;
    const access_token = await getAccessTokenFromSessionStorage();
    const auth = `Bearer ${access_token}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: auth,
        "Content-Type": "application/json",
      },
    });
    return response.data || { libraryValues: [] };
  } catch (err) {
    console.error(
      "Error while retrieving all the library values:",
      err.response?.data?.message || err.message
    );
    return { libraryValues: [] };
  }
};

export const getComponents = async () => {
  let url =
    `${process.env.REACT_APP_TNLCM_BACKEND_API}/sites/` +
    sitesBranch +
    `/` +
    deploymentSite;
  const access_token = await getAccessTokenFromSessionStorage();
  const auth = `Bearer ${access_token}`;
  const response = await axios.get(url, {
    headers: {
      "Deployment-Site-Token": siteToken,
      Authorization: auth,
      "Content-Type": "application/json",
    },
  });
  return response || { components: [] };
};

export const getComponent = async (name) => {
  const access_token = await getAccessTokenFromSessionStorage();
  if (access_token) {
    const url = process.env.REACT_APP_TNLCM_BACKEND_API;
    const bearerJwt = `Bearer ${access_token}`;
    try {
      const response = await axios.get(
        `${url}/library/` + libraryRef + `/` + libraryValue + `/${name}`,
        {
          headers: {
            Authorization: bearerJwt,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching data for ${name}:`, error);
    }
  }
  return null;
};

export const getTnMarkdown = async (id) => {
  const access_token = await getAccessTokenFromSessionStorage();
  const auth = `Bearer ${access_token}`;
  let url = `${process.env.REACT_APP_TNLCM_BACKEND_API}/trial-networks/${id}/report/content`;
  const response = await axios.get(url, {
    headers: {
      Authorization: auth,
      "Content-Type": "application/json",
    },
  });
  return response;
};

export async function loginUser(username, password, config = {}) {
  const authString = `${username}:${password}`;
  const encodedAuth = window.btoa(unescape(encodeURIComponent(authString))); // Special encoding for base64
  const basicAuthHeader = `Basic ${encodedAuth}`;
  try {
    const url = `${process.env.REACT_APP_TNLCM_BACKEND_API}/user/login`;
    // Make the POST request to the login endpoint
    const response = await axios.post(
      url,
      {},
      {
        headers: {
          Authorization: basicAuthHeader, // Authorization header with basic auth
          "Content-Type": "application/json",
        },
        ...config, // Add any other configuration
      }
    );

    // Return the response
    return response;
  } catch (err) {
    // Make sure to return the error
    throw err.response?.data?.message || err.message;
  }
}

export const createAccount = async (accountData) => {
  const url = `${process.env.REACT_APP_TNLCM_BACKEND_API}/user/register`;
  try {
    const response = await axios.post(url, accountData);
    return response;
  } catch (err) {
    throw err.response?.data?.message || err.message;
  }
};

export const changePwd = async (oldPwd, newPwd, username) => {
  try {
    const url = `${process.env.REACT_APP_TNLCM_BACKEND_API}/user/change-password`;
    const access_token = await getAccessTokenFromSessionStorage();
    const auth = `Bearer ${access_token}`;
    const payload = {
      username: username,
      old_password: oldPwd,
      new_password: newPwd,
    };
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: auth,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (err) {
    throw err.response?.data?.message || err.message;
  }
};

export const refreshToken = async () => {
  try {
    const url = process.env.REACT_APP_TNLCM_BACKEND_API;
    const response = await axios.post(
      `${url}/user/refresh`,
      {},
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );
    if (!response.data || !response.data.access_token) {
      throw new Error("Failed to refresh access token.");
    }
    return response.data; // Return the new access token
  } catch (error) {
    throw new Error("Failed to fetch a new access token: " + error.message);
  }
};

export async function getLogs(vmId) {
  const access_token = await getAccessTokenFromSessionStorage();
  const response = await axios.get(
    `${process.env.REACT_APP_TNLCM_BACKEND_API}/trial-networks/${vmId}/log/content`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
  return response;
}
