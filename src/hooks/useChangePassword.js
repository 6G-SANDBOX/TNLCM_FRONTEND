import { useState } from "react";
import { useRouter } from "next/navigation";
import { changePassword } from "@/lib/apiHandler";

export default function useChangePassword() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [resetToken, setResetToken] = useState();
    const router = useRouter();

    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            await changePassword(email, password, resetToken);
            router.push("/tnlcm/login");
        } catch (error) {
            alert(error);
        }
    };

    const handleKeyPress = async (e) => {
        if (e.key === "Enter") {
            await handleChangePassword(e);
        }
    };

    return {
        password,
        setPassword,
        email,
        setEmail,
        resetToken,
        setResetToken,
        handleChangePassword,
        handleKeyPress
    };
};