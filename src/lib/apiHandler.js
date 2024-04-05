/* --------------- Users --------------- */

export async function loginUser(username, password) {
    const authString = `${username}:${password}`;
    const encodedAuth = Buffer.from(authString).toString("base64");
    const basicAuthHeader = `Basic ${encodedAuth}`;
  
    const fetchLoginUser = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_TNLCM_BACKEND}/tnlcm/user/login`, {
                method: "POST",
                headers: {
                    "Authorization": basicAuthHeader,
                    "Content-Type": "application/json"
                }
            });
            return response;
        } catch (error) {
            throw new Error("Failed to fetch data" + error);
        }
    };
    
    const response = await fetchLoginUser();
    const data = await response.json();
    const code_error = response["status"];
    if (!response.ok) {
        const { message } = data;
        throw new Error(message + ". \nError code: " + code_error);
    }
    return data;
};

export async function registerUser(username, password, email, org) {

    const fetchRegisterUser = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_TNLCM_BACKEND}/tnlcm/user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password, email, org })
            });
            return response;
        } catch (error) {
            throw new Error("Failed to fetch data" + error);
        }
    };

    const response = await fetchRegisterUser();
    const data = await response.json();
    const code_error = response["status"];
    if (!response.ok) {
        const { message } = data;
        throw new Error(message + ". \nError code: " + code_error);
    }
    return data;
};

/* --------------- Trial Networks --------------- */

export async function getTrialNetworks(token) {

    const fetchTrialNetworks = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_TNLCM_BACKEND}/tnlcm/trial_networks/`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            return response;
        } catch (error) {
            throw new Error("Failed to fetch data" + error);
        }
    };

    const response = await fetchTrialNetworks();
    const data = await response.json();
    const code_error = response["status"];
    if (!response.ok) {
        const { message } = data;
        throw new Error(message + ". \nError code: " + code_error);
    }
    return data;
};

export async function createTrialNetwork(token, tnId, yamlData) {
    const blob = new Blob([yamlData], { type: "text/yaml" });
    const formData = new FormData();
    formData.append("tn_id", tnId);
    formData.append("descriptor", blob, "descriptor.yaml");

    const fetchCreateTrialNetwork = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_TNLCM_BACKEND}/tnlcm/trial_network`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });
            return response;
        } catch (error) {
            throw new Error("Failed to fetch data" + error);
        }
    };
    
    const response = await fetchCreateTrialNetwork();
    const data = await response.json();
    const code_error = response["status"];
    if (!response.ok) {
        const { message } = data;
        throw new Error(message + ". \nError code: " + code_error);
    }
    return data['tn_id'];
};

export async function getDescriptorTrialNetwork(token, tnId) {

    const fetchDescriptorTrialNetwork = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_TNLCM_BACKEND}/tnlcm/trial_network/${tnId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            return response;
        } catch (error) {
            throw new Error("Failed to fetch data" + error);
        }
    };

    const response = await fetchDescriptorTrialNetwork();
    const data = await response.json();
    const code_error = response["status"];
    if (!response.ok) {
        const { message } = data;
        throw new Error(message + ". \nError code: " + code_error);
    }
    return data;
};

export async function deployTrialNetwork(token, tnId, selectedOption, branch, commitId) {
    let bodyData = {};

    if (selectedOption === "branch") {
        bodyData = { "branch": branch };
    } else {
        bodyData = { "commit_id": commitId };
    }

    const fetchDeployTrialNetwork = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_TNLCM_BACKEND}/tnlcm/trial_network/${tnId}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bodyData)
            });
            return response;
        } catch (error) {
            throw new Error("Failed to fetch data" + error);
        }
    };

    const response = await fetchDeployTrialNetwork();
    const data = await response.json();
    const code_error = response["status"];
    if (!response.ok) {
        const { message } = data;
        throw new Error(message + ". \nError code: " + code_error);
    }
    return data;
};

export async function getReportTrialNetwork(token, tnId) {

    const fetchReportTrialNetwork = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_TNLCM_BACKEND}/tnlcm/trial_network/report/${tnId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            return response;
        } catch (error) {
            throw new Error("Failed to fetch data" + error);
        }
    };

    const response = await fetchReportTrialNetwork();
    const data = await response.json();
    const code_error = response["status"];
    if (!response.ok) {
        const { message } = data;
        throw new Error(message + ". \nError code: " + code_error);
    }
    return data["tn_report"];
};

export async function getStatusTrialNetworks(token) {

    const fetchStatusTrialNetworks = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_TNLCM_BACKEND}/tnlcm/trial_networks/status/`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            return response;
        } catch (error) {
            throw new Error("Failed to fetch data" + error);
        }
    };

    const response = await fetchStatusTrialNetworks();
    const data = await response.json();
    const code_error = response["status"];
    if (!response.ok) {
        const { message } = data;
        throw new Error(message + ". \nError code: " + code_error);
    }
    return data;
};

/* --------------- 6G-Library --------------- */

export async function getComponents6GLibrary(branch, commitId) {

    const fetchComponents6GLibrary = async () => {
        let url = "";
        if (branch !== "") {
            url = `${process.env.NEXT_PUBLIC_TNLCM_BACKEND}/tnlcm/6glibrary/components/?branch=${branch}`;
        } else {
            url = `${process.env.NEXT_PUBLIC_TNLCM_BACKEND}/tnlcm/6glibrary/components/?commit_id=${commitId}`;
        }
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            return response;
        } catch (error) {
            throw new Error("Failed to fetch data" + error);
        }
    };

    const response = await fetchComponents6GLibrary();
    const data = await response.json();
    const code_error = response["status"];
    if (!response.ok) {
        const { message } = data;
        throw new Error(message + ". \nError code: " + code_error);
    }
    return data["components"];
};