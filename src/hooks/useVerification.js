import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerVerification, resetVerification } from "@/lib/apiHandler";

export default function useVerification() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegisterVerification = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await registerVerification(email);
            router.push("/tnlcm/register");
        } catch (error) {
            alert(error);
        } finally {
            setLoading(false);
        }
    };

    const handleResetVerification = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await resetVerification(email);
            router.push("/tnlcm/change_password");
        } catch (error) {
            alert(error);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyRegisterVerificationPress = async (e) => {
        if (e.key === "Enter") {
            await handleRegisterVerification(e);
        }
    };

    const handleKeyResetVerificationPress = async (e) => {
        if (e.key === "Enter") {
            await handleResetVerification(e);
        }
    };

    return {
        email,
        setEmail,
        loading,
        handleRegisterVerification,
        handleResetVerification,
        handleKeyRegisterVerificationPress,
        handleKeyResetVerificationPress,
    };
};