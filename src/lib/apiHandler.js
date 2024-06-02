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
            throw new Error("Failed to fetch data \n" + error);
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_TNLCM_BACKEND}/tnlcm/verification-token/new-user-verification`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password, email, "verification_token": verificationToken, org })
            });
            return response;
        } catch (error) {
            throw new Error("Failed to fetch data \n" + error);
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

export async function registerVerification(email) {

    const fetchRegisterVerification = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_TNLCM_BACKEND}/tnlcm/verification-token/request-verification-token`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            });
            return response;
        } catch (error) {
            throw new Error("Failed to fetch data \n" + error);
        }
    };

    const response = await fetchRegisterVerification();
    const data = await response.json();
    const code_error = response["status"];
    if (!response.ok) {
        const { message } = data;
        throw new Error(message + ". \nError code: " + code_error);
    }
    return data;
};

export async function resetVerification(email) {

    const fetchResetVerification = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_TNLCM_BACKEND}/tnlcm/verification-token/request-reset-token`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            });
            return response;
        } catch (error) {
            throw new Error("Failed to fetch data \n" + error);
        }
    };

    const response = await fetchResetVerification();
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_TNLCM_BACKEND}/tnlcm/verification-token/change-password`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password, "reset_token": resetToken })
            });
            return response;
        } catch (error) {
            throw new Error("Failed to fetch data \n" + error);
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_TNLCM_BACKEND}/tnlcm/trial-networks/`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            return response;
        } catch (error) {
            throw new Error("Failed to fetch data \n" + error);
        }
    };

    const response = await fetchTrialNetworks();
    const data = await response.json();
    const code_error = response["status"];
    if (!response.ok) {
        const { message } = data;
        throw new Error(message + ". \nError code: " + code_error);
    }
    return data["trial_networks"];
};

export async function createTrialNetwork(token, tnId, deploymentSite, github6GLibraryReference, github6GSandboxSitesReference, descriptor) {
    const blob = new Blob([descriptor], { type: "text/yaml" });
    const formData = new FormData();
    formData.append("descriptor", blob, "descriptor.yaml");

    let url = `${process.env.NEXT_PUBLIC_TNLCM_BACKEND}/tnlcm/trial-network?deployment_site=${deploymentSite}&github_6g_library_reference=${github6GLibraryReference}&github_6g_sandbox_sites_reference=${github6GSandboxSitesReference}`
    if (tnId !== "") {
        url = `${process.env.NEXT_PUBLIC_TNLCM_BACKEND}/tnlcm/trial-network?tn_id=${tnId}&deployment_site=${deploymentSite}&github_6g_library_reference=${github6GLibraryReference}&github_6g_sandbox_sites_reference=${github6GSandboxSitesReference}`
    }

    const fetchCreateTrialNetwork = async () => {
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });
            return response;
        } catch (error) {
            throw new Error("Failed to fetch data \n" + error);
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

export async function trialNetworkStateMachine(token, tnId, jobName) {

    let url = `${process.env.NEXT_PUBLIC_TNLCM_BACKEND}/tnlcm/trial-network/${tnId}`
    if (jobName !== "") {
        url = `${process.env.NEXT_PUBLIC_TNLCM_BACKEND}/tnlcm/trial-network/${tnId}?job_name=${jobName}`
    }
    
    const fetchTrialNetworkStateMachine = async () => {
        try {
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            return response;
        } catch (error) {
            throw new Error("Failed to fetch data \n" + error);
        }
    };

    const response = await fetchTrialNetworkStateMachine();
    const data = await response.json();
    const code_error = response["status"];
    if (!response.ok) {
        const { message } = data;
        throw new Error(message + ". \nError code: " + code_error);
    }
    return data;
};

export async function getTrialNetwork(token, tnId) {

    const fetchTrialNetwork = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_TNLCM_BACKEND}/tnlcm/trial-network/${tnId}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            return response;
        } catch (error) {
            throw new Error("Failed to fetch data \n" + error);
        }
    };

    const response = await fetchTrialNetwork();
    const data = await response.json();
    const code_error = response["status"];
    if (!response.ok) {
        const { message } = data;
        throw new Error(message + ". \nError code: " + code_error);
    }
    return data["tn_sorted_descriptor"];
};

export async function getTrialNetworkReport(token, tnId) {

    const fetchTrialNetworkReport = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_TNLCM_BACKEND}/tnlcm/trial-network/report/${tnId}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            return response;
        } catch (error) {
            throw new Error("Failed to fetch data \n" + error);
        }
    };

    const response = await fetchTrialNetworkReport();
    const data = await response.json();
    const code_error = response["status"];
    if (!response.ok) {
        const { message } = data;
        throw new Error(message + ". \nError code: " + code_error);
    }
    return data["tn_report"];
};

export async function getTrialNetworksTemplates(token) {

    const fetchTrialNetworksTemplates = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_TNLCM_BACKEND}/tnlcm/trial-networks/templates/`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            return response;
        } catch (error) {
            throw new Error("Failed to fetch data \n" + error);
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

export async function deleteTrialNetwork(token, tnId) {

    const fetchDeleteTrialNetwork = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_TNLCM_BACKEND}/tnlcm/trial-network/${tnId}`, {
                method: "DELETE",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            return response;
        } catch (error) {
            throw new Error("Failed to fetch data \n" + error);
        }
    };

    const response = await fetchDeleteTrialNetwork();
    const data = await response.json();
    const code_error = response["status"];
    if (!response.ok) {
        const { message } = data;
        throw new Error(message + ". \nError code: " + code_error);
    }
    return data;
};

/* --------------- 6G-Library --------------- */

export async function getSixGLibraryBranches() {

    const fetchSixGLibraryBranches = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_TNLCM_BACKEND}/tnlcm/6G-Library/branches/`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            });
            return response;
        } catch (error) {
            throw new Error("Failed to fetch data \n" + error);
        }
    };

    const response = await fetchSixGLibraryBranches();
    const data = await response.json();
    const code_error = response["status"];
    if (!response.ok) {
        const { message } = data;
        throw new Error(message + ". \nError code: " + code_error);
    }
    return data["branches"];
};

export async function getSitePartsComponents(githubSixGLibraryReference, githubSixGSandboxSitesReference, site) {

    let url = `${process.env.NEXT_PUBLIC_TNLCM_BACKEND}/tnlcm/6G-Library/components/all?site=${site}`;
    if (githubSixGLibraryReference !== "") {
        url += `&github_6g_library_reference=${githubSixGLibraryReference}`;
    }
    if (githubSixGSandboxSitesReference !== "") {
        url += `&github_6g_sandbox_sites_reference=${githubSixGSandboxSitesReference}`;
    }

    const fetchSitePartsComponents = async () => {
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
            throw new Error("Failed to fetch data \n" + error);
        }
    };

    const response = await fetchSitePartsComponents();
    const data = await response.json();
    const code_error = response["status"];
    if (!response.ok) {
        const { message } = data;
        throw new Error(message + ". \nError code: " + code_error);
    }
    return data["parts_components"];
};

/* ------------ 6G-Sandbox-Sites ------------ */

export async function getSixGSandboxSitesBranches() {

    const fetchSixGSandboxSitesBranches = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_TNLCM_BACKEND}/tnlcm/6G-Sandbox-Sites/branches/`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            });
            return response;
        } catch (error) {
            throw new Error("Failed to fetch data \n" + error);
        }
    };

    const response = await fetchSixGSandboxSitesBranches();
    const data = await response.json();
    const code_error = response["status"];
    if (!response.ok) {
        const { message } = data;
        throw new Error(message + ". \nError code: " + code_error);
    }
    return data["branches"];
};

export async function getSites(reference) {

    const fetchSites = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_TNLCM_BACKEND}/tnlcm/6G-Sandbox-Sites/sites?reference=${reference}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            });
            return response;
        } catch (error) {
            throw new Error("Failed to fetch data \n" + error);
        }
    };

    const response = await fetchSites();
    const data = await response.json();
    const code_error = response["status"];
    if (!response.ok) {
        const { message } = data;
        throw new Error(message + ". \nError code: " + code_error);
    }
    return data["sites"];
};