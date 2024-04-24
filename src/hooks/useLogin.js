import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/apiHandler";
import { saveAccessTokenToLocalStorage, saveRefreshTokenToLocalStorage } from "@/lib/jwtHandler";

export default function useLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const tokens = await loginUser(username, password);
            saveAccessTokenToLocalStorage(tokens["access_token"]);
            saveRefreshTokenToLocalStorage(tokens["refresh_token"]);
            router.push("/tnlcm/dashboard");
        } catch (error) {
            alert(error);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = async (e) => {
        if (e.key === "Enter") {
            await handleLogin(e);
        }
    };
    
    return {
        username,
        setUsername,
        password,
        setPassword,
        loading,
        handleLogin,
        handleKeyPress
    };
};