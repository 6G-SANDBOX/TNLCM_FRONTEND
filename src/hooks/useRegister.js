import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/apiHandler";

export default function useRegister() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [verificationToken, setVerificationToken] = useState();
    const [org, setOrg] = useState("");
    const router = useRouter();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await registerUser(username, password, email, verificationToken, org);
            router.push("/tnlcm/login");
        } catch (error) {
            alert(error);
        }
    };

    const handleKeyPress = async (e) => {
        if (e.key === "Enter") {
            await handleRegister(e);
        }
    };

    return {
        username,
        setUsername,
        password,
        setPassword,
        email,
        setEmail,
        verificationToken,
        setVerificationToken,
        org,
        setOrg,
        handleRegister,
        handleKeyPress
    };
};