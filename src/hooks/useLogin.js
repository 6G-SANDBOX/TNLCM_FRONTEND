import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/apiHandler";
import { saveAccessTokenToLocalStorage, saveRefreshTokenToLocalStorage } from "@/lib/jwtHandler";

export default function useLogin() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (username, password) => {
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
    return { handleLogin, loading };
};