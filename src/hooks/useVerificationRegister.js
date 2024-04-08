import { useState } from "react";
import { useRouter } from "next/navigation";
import { verificationRegister, resetVerificationRegister } from "@/lib/apiHandler";

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

    const handleResetVerificationRegister = async (e) => {
        e.preventDefault();
        try {
            await resetVerificationRegister(email);
            router.push("/tnlcm/change-password");
        } catch (error) {
            alert(error);
        }
    }

    const handleKeyVerificationRegisterPress = async (e) => {
        if (e.key === "Enter") {
            await handleVerificationRegister(e);
        }
    };

    const handleKeyResetVerificationRegisterPress = async (e) => {
        if (e.key === "Enter") {
            await handleResetVerificationRegister(e);
        }
    };

    return {
        email,
        setEmail,
        handleVerificationRegister,
        handleResetVerificationRegister,
        handleKeyVerificationRegisterPress,
        handleKeyResetVerificationRegisterPress,
    };
};