export async function loginUser(username, password) {
    const authString = `${username}:${password}`;
    const encodedAuth = Buffer.from(authString).toString('base64');
    const basicAuthHeader = `Basic ${encodedAuth}`;
  
    const fetchLoginUser = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_TNLCM_BACKEND}/tnlcm/user/login`, {
                method: 'POST',
                headers: {
                    'Authorization': basicAuthHeader,
                    'Content-Type': 'application/json'
                }
            });
            return response
        } catch (error) {
            throw new Error('Failed to fetch data' + error);
        }
    };
    
    const response = await fetchLoginUser();
    const data = await response.json();
    const code_error = response.status;
    if (!response.ok) {
        const { message } = data;
        throw new Error(message + '. \nError code: ' + code_error);
    }
    return data;
};

export async function registerUser(username, password, email, org) {

    const fetchRegisterUser = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_TNLCM_BACKEND}/tnlcm/user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password, email, org })
            });
            return response
        } catch (error) {
            throw new Error('Failed to fetch data' + error);
        }
    };

    const response = await fetchRegisterUser();
    const data = await response.json();
    const code_error = response.status;
    if (!response.ok) {
        const { message } = data;
        throw new Error(message + '. \nError code: ' + code_error);
    }
    return data;
};

export async function getTrialNetworks(token) {

    const fetchTrialNetworks = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_TNLCM_BACKEND}/tnlcm/trial_networks/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response
        } catch (error) {
            throw new Error('Failed to fetch data' + error);
        }
    };

    const response = await fetchTrialNetworks();
    const data = await response.json();
    const code_error = response.status;
    if (!response.ok) {
        const { message } = data;
        throw new Error(message + '. \nError code: ' + code_error);
    }
    return data;
};