// Fetching
// TODO: Check try/catch
export async function loginUser(username, password) {
    const authString = `${username}:${password}`;
    const encodedAuth = Buffer.from(authString).toString('base64');
    const basicAuthHeader = `Basic ${encodedAuth}`;
  
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_TNLCM_BACKEND}/tnlcm/user/login`, {
            method: 'POST',
            headers: {
                'Authorization': basicAuthHeader,
                'Content-Type': 'application/json'
            }
        });
  
        if (!response.ok) {
            throw new Error('Error in authentication');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error('Network error: ' + error.message);
    }
};

export async function registerUser(username, password, email) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_TNLCM_BACKEND}/tnlcm/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, email })
        });

        if (!response.ok) {
            throw new Error('Error when registering the user');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching user data:', error.message);
        throw error;
    }
};

export async function getTrialNetworks(token) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_TNLCM_BACKEND}/tnlcm/trial_networks/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching user data:', error.message);
        throw error;
    }
};