import { useState } from "react";
import { useRouter } from "next/navigation";
import { verificationRegister } from "@/lib/apiHandler";

export default function useVerificationRegister() {
    const [email, setEmail] = useState("");
    const router = useRouter();

    const handleVerificationRegister = async (e) => {
        e.preventDefault();
        try {
            await verificationRegister(email);
            router.push("/tnlcm/register");
        } catch (error) {
            alert(error);
        }
    };

    const handleKeyPress = async (e) => {
        if (e.key === "Enter") {
            await handleVerificationRegister(e);
        }
    };

    return {
        email,
        setEmail,
        handleVerificationRegister,
        handleKeyPress
    };
};