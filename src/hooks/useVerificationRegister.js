import { useState } from "react";
import { useRouter } from "next/navigation";
import { verificationRegister, resetVerificationRegister } from "@/lib/apiHandler";

export default function useVerificationRegister() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleVerificationRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await verificationRegister(email);
            router.push("/tnlcm/register");
        } catch (error) {
            alert(error);
        } finally {
            setLoading(false);
        }
    };

    const handleResetVerificationRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await resetVerificationRegister(email);
            router.push("/tnlcm/change_password");
        } catch (error) {
            alert(error);
        } finally {
            setLoading(false);
        }
    };

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
        loading,
        handleVerificationRegister,
        handleResetVerificationRegister,
        handleKeyVerificationRegisterPress,
        handleKeyResetVerificationRegisterPress,
    };
};