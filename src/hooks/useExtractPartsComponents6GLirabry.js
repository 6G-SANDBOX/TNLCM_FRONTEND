import { useState } from "react";
import { getExtractPartsComponents6GLibrary } from "@/lib/apiHandler";

export default function useExtractPartsComponents6GLirabry() {
    const [commitId, setCommitId] = useState("");
    const [branch, setBranch] = useState("alt_architecture");
    const [components, setComponents] = useState({})
    const [loading, setLoading] = useState(false);

    const handleExtractPartsComponents6GLibrary = async (e) => {
        // e.preventDefault();
        setLoading(true);
        try {
            const response = await getExtractPartsComponents6GLibrary(branch, commitId);
            setComponents(response);
        } catch (error) {
            alert(error);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyExtractPartsComponents6GLibraryPress = async (e) => {
        if (e.key === "Enter") {
            await handleExtractPartsComponents6GLibrary(e);
        }
    }

    return {
        branch,
        setBranch,
        commitId,
        setCommitId,
        components,
        loading,
        handleExtractPartsComponents6GLibrary,
        handleKeyExtractPartsComponents6GLibraryPress
    }
}