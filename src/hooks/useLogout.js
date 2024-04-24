import { useRouter } from "next/navigation";
import { clearAuthTokens } from "@/lib/jwtHandler";

export default function useLogout() {
    const router = useRouter();

    const handleLogout = () => {
        clearAuthTokens();
        router.push("/tnlcm/login");
    };

    return handleLogout;
};