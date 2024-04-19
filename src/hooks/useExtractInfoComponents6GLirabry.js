import { useState } from "react";
import { getExtractInfoComponents6GLibrary } from "@/lib/apiHandler";

export default function useExtractInfoComponents6GLirabry() {
    const [commitId, setCommitId] = useState("");
    const [branch, setBranch] = useState("");
    const [components, setComponents] = useState({})
    const [loading, setLoading] = useState(false);

    const handleExtractInfoComponents6GLibrary = async (e) => {
        // e.preventDefault();
        setLoading(true);
        try {
            const response = await getExtractInfoComponents6GLibrary(branch, commitId);
            setComponents(response);
        } catch (error) {
            alert(error);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyExtractInfoComponents6GLibraryPress = async (e) => {
        if (e.key === "Enter") {
            await handleExtractInfoComponents6GLibrary(e);
        }
    }

    return {
        branch,
        setBranch,
        commitId,
        setCommitId,
        components,
        loading,
        handleExtractInfoComponents6GLibrary,
        handleKeyExtractInfoComponents6GLibraryPress
    }
}