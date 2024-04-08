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

export async function registerUser(username, password, email, verificationToken, org) {

    const fetchRegisterUser = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_TNLCM_BACKEND}/tnlcm/verification/new-user-verification`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password, email, "verification_token": verificationToken, org })
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

export async function verificationRegister(email) {

    const fetchVerificationRegister = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_TNLCM_BACKEND}/tnlcm/verification/request-verification-token`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            });
            return response;
        } catch (error) {
            throw new Error("Failed to fetch data" + error);
        }
    };

    const response = await fetchVerificationRegister();
    const data = await response.json();
    const code_error = response["status"];
    if (!response.ok) {
        const { message } = data;
        throw new Error(message + ". \nError code: " + code_error);
    }
    return data;
};

export async function resetVerificationRegister(email) {

    const fetchResetVerificationRegister = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_TNLCM_BACKEND}/tnlcm/verification/request-reset-token`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            });
            return response;
        } catch (error) {
            throw new Error("Failed to fetch data" + error);
        }
    };

    const response = await fetchResetVerificationRegister();
    const data = await response.json();
    const code_error = response["status"];
    if (!response.ok) {
        const { message } = data;
        throw new Error(message + ". \nError code: " + code_error);
    }
    return data;
};

export async function changePassword(email, password, resetToken) {

    const fetchChangePassword = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_TNLCM_BACKEND}/tnlcm/verification/change-password`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password, "reset_token": resetToken })
            });
            return response;
        } catch (error) {
            throw new Error("Failed to fetch data" + error);
        }
    };

    const response = await fetchChangePassword();
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
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
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

export async function createTrialNetwork(token, yamlData) {
    const blob = new Blob([yamlData], { type: "text/yaml" });
    const formData = new FormData();
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
    return data["tn_id"];
};

export async function getDescriptorTrialNetwork(token, tnId) {

    const fetchDescriptorTrialNetwork = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_TNLCM_BACKEND}/tnlcm/trial_network/${tnId}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
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
    return data["tn_descriptor"];
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
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
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
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
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
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
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
    return data["trial_networks_status"];
};

export async function getTrialNetworksTemplates(token) {

    const fetchTrialNetworksTemplates = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_TNLCM_BACKEND}/tnlcm/trial_networks/templates/`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            return response;
        } catch (error) {
            throw new Error("Failed to fetch data" + error);
        }
    };

    const response = await fetchTrialNetworksTemplates();
    const data = await response.json();
    const code_error = response["status"];
    if (!response.ok) {
        const { message } = data;
        throw new Error(message + ". \nError code: " + code_error);
    }
    return data["trial_networks_templates"];
};

/* --------------- 6G-Library --------------- */

export async function getExtractInfoComponents6GLibrary(branch, commitId) {

    const fetchExtractInfoComponents6GLibrary = async () => {
        let url = "";
        if (branch !== "") {
            url = `${process.env.NEXT_PUBLIC_TNLCM_BACKEND}/tnlcm/6glibrary/components/all?branch=${branch}`;
        } else if (commitId !== "") {
            url = `${process.env.NEXT_PUBLIC_TNLCM_BACKEND}/tnlcm/6glibrary/components/all?commit_id=${commitId}`;
        } else {
            url = `${process.env.NEXT_PUBLIC_TNLCM_BACKEND}/tnlcm/6glibrary/components/all`
        }
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            });
            return response;
        } catch (error) {
            throw new Error("Failed to fetch data" + error);
        }
    };

    const response = await fetchExtractInfoComponents6GLibrary();
    const data = await response.json();
    const code_error = response["status"];
    if (!response.ok) {
        const { message } = data;
        throw new Error(message + ". \nError code: " + code_error);
    }
    return data["components"];
};