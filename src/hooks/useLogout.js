import { useRouter } from "next/navigation";
import { clearAuthTokens } from "@/lib/jwtHandler";

export default function useLogout() {
    const router = useRouter();

    const handleLogout = async () => {
        await clearAuthTokens();
        router.push("/tnlcm/login");
    };

    return handleLogout;
};