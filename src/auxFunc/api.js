import axios from "axios";
import { getAccessTokenFromSessionStorage } from "../auxFunc/jwt";

export const createTrialNetwork = async (formData,url) => {
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

export const saveTrialNetwork = async (formData,id) => {
    const access_token = await getAccessTokenFromSessionStorage();
    const auth = `Bearer ${access_token}`;
    let url = `${process.env.REACT_APP_TNLCM_BACKEND_API}/tnlcm/trial-network/create?tn_id=${id}`;
    const response = await axios.post(url, formData, {
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
    let url = `${process.env.REACT_APP_TNLCM_BACKEND_API}/tnlcm/trial-networks`
    const response = await axios.get(url, {
        headers: {
            Authorization: auth,
            "Content-Type": "application/json",
        },
    });
    return response;
}

export const purgeTN = async (id) => {
    const access_token = await getAccessTokenFromSessionStorage();
    const auth = `Bearer ${access_token}`;
    let url = `${process.env.REACT_APP_TNLCM_BACKEND_API}}/tnlcm/trial-network/purge/${id}`
    const response = await axios.delete(url, {
        headers: {
            Authorization: auth,
            "Content-Type": "application/json",
        },
    });
    return response;
}

export const deleteTN = async (id) => {
    const access_token = await getAccessTokenFromSessionStorage();
    const auth = `Bearer ${access_token}`;
    let url = `${process.env.REACT_APP_TNLCM_BACKEND_API}/tnlcm/trial-network/${id}`
    const response = await axios.delete(url, {
        headers: {
            Authorization: auth,
            "Content-Type": "application/json",
        },
    });
    return response;
}

export const putTN = async (id) => {
    const access_token = await getAccessTokenFromSessionStorage();
    const auth = `Bearer ${access_token}`;
    let url = `${process.env.REACT_APP_TNLCM_BACKEND_API}/tnlcm/trial-network/${id}`
    const response = await axios.put(url,{}, {
        headers: {
            Authorization: auth,
            "Content-Type": "application/json",
        },
    });
    return response;
}

export const getComponents= async (type, value) => {
    //Need to be delayed due to the backend
    // const delay = Math.floor(Math.random() * 4000) + 1000;
    // await new Promise(resolve => setTimeout(resolve, delay));

    let url = `${process.env.REACT_APP_TNLCM_BACKEND_API}/tnlcm/library/${type}/${value}`
    const response = await fetch(url);
    return response || {components : []};
}

export const getUser = async () => {
    try {
      const url = `${process.env.REACT_APP_TNLCM_BACKEND_API}/tnlcm/user`;
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
      console.error("Error while retrieving user info:", err.response?.data?.message || err.message);
    }
};
  
export  const getSites = async () => {
    try {
      const url = `${process.env.REACT_APP_TNLCM_BACKEND_API}/tnlcm/sites/branches`;
      const access_token = await getAccessTokenFromSessionStorage();
      const auth = `Bearer ${access_token}`;
  
      const response = await axios.get(url, {
        headers: {
          Authorization: auth,
          "Content-Type": "application/json",
        },
      });
      return response.data || {sites : []};
    } catch (err) {
      console.error("Error while retrieving all the sites:", err.response?.data?.message || err.message);
      return {sites : []};
    }
}

export const getDeployments = async (deplo) => {
    try {
        const url = `${process.env.REACT_APP_TNLCM_BACKEND_API}/tnlcm/sites/${deplo}`;
        const access_token = await getAccessTokenFromSessionStorage();
        const auth = `Bearer ${access_token}`;
    
        const response = await axios.get(url, {
          headers: {
            Authorization: auth,
            "Content-Type": "application/json",
          },
        });
        return response.data || {deployments : []};
      } catch (err) {
        console.error("Error while retrieving all the directories from the branch:", err.response?.data?.message || err.message);
        return {deployments : []};
      }
  }

export const getLibraryTypes = async () => {
    try {
        const url = `${process.env.REACT_APP_TNLCM_BACKEND_API}/tnlcm/library/library_references_types`;
        const access_token = await getAccessTokenFromSessionStorage();
        const auth = `Bearer ${access_token}`;
    
        const response = await axios.get(url, {
          headers: {
            Authorization: auth,
            "Content-Type": "application/json",
          },
        });
        return response.data || {libraryTypes : []};
      } catch (err) {
        console.error("Error while retrieving all the library types:", err.response?.data?.message || err.message);
        return {libraryTypes : []};
      }
}

export const getLibraryValues = async (type) => {
    try {
        const url = `${process.env.REACT_APP_TNLCM_BACKEND_API}/tnlcm/library/${type}`;
        const access_token = await getAccessTokenFromSessionStorage();
        const auth = `Bearer ${access_token}`;
    
        const response = await axios.get(url, {
          headers: {
            Authorization: auth,
            "Content-Type": "application/json",
          },
        });
        return response.data || {libraryTypes : []};
      } catch (err) {
        console.error("Error while retrieving all the library values:", err.response?.data?.message || err.message);
        return {libraryTypes : []};
      }
}

export const getComponent = async (type, value,name) => {

  const delay = Math.floor(Math.random() * 4000) + 2000;
  await new Promise(resolve => setTimeout(resolve, delay));
  const access_token = await getAccessTokenFromSessionStorage();
  if (access_token) {
    const url = process.env.REACT_APP_TNLCM_BACKEND_API;
    const bearerJwt = `Bearer ${access_token}`;
    
    try {
      const response = await axios.get(`${url}/tnlcm/library/${type}/${value}/${name}`, {
        headers: {
          Authorization: bearerJwt,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      alert(`Error fetching data for ${name}:`, error);
      return null;
    }
  }
  return null;
};

export const getTrialNetwork = async (id) => {
    const access_token = await getAccessTokenFromSessionStorage();
    const auth = `Bearer ${access_token}`;
    let url = `${process.env.REACT_APP_TNLCM_BACKEND_API}/tnlcm/trial-network/${id}`
    const response = await axios.get(url, {
        headers: {
            Authorization: auth,
            "Content-Type": "application/json",
        },
    });
    return response;
}

export const getTnMarkdown = async (id) => {
  const access_token = await getAccessTokenFromSessionStorage();
  const auth = `Bearer ${access_token}`;
  let url = `${process.env.REACT_APP_TNLCM_BACKEND_API}/tnlcm/trial-networks/${id}.md`
  const response = await axios.get(url, {
      headers: {
          Authorization: auth,
          "Content-Type": "application/json",
      },
  });
  return response;
}

