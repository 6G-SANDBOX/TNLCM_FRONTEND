import { useState } from "react";
import { remark } from "remark";
import html from "remark-html";
import { getAccessTokenFromLocalStorage } from "@/lib/jwtHandler";
import { getReportTrialNetwork } from "@/lib/apiHandler";

export default function useReport() {
    const [tnId, setTnId] = useState("");
    const [tnReport, setTnReport] = useState("");
    const [loading, setLoading] = useState(false);

    const handleReportTrialNetwork = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = await getAccessTokenFromLocalStorage();
            const tnReportMarkdown = await getReportTrialNetwork(token, tnId);
            const htmlContent = await convertMarkdownToHtml(tnReportMarkdown);
            setTnReport(htmlContent)
        } catch (error) {
            alert("Error al reportar la red de prueba: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const convertMarkdownToHtml = async (markdown) => {
        const processedContent = await remark().use(html).process(markdown);
        const contentHtml = processedContent.toString();
        return contentHtml;
    };

    return {
        tnId,
        setTnId,
        tnReport,
        loading,
        handleReportTrialNetwork
    };
};