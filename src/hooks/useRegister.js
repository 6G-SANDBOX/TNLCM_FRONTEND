import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/apiHandler";

export default function useRegister () {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [org, setOrg] = useState("");
    const router = useRouter();

    const handleRegister = async () => {
        try {
            await registerUser(username, password, email, org);
            router.push("/tnlcm/login");
        } catch (error) {
            alert(error);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleRegister(e);
        }
    };

    return {
        username,
        setUsername,
        password,
        setPassword,
        email,
        setEmail,
        org,
        setOrg,
        handleRegister,
        handleKeyPress
    };
};