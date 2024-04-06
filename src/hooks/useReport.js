import { useState } from "react";
import { remark } from "remark";
import html from "remark-html";
import { getAccessTokenFromLocalStorage } from "@/lib/jwtHandler";
import { getReportTrialNetwork } from "@/lib/apiHandler";

export default function useReport() {
    const [tnId, setTnId] = useState("");
    const [tnReport, setTnReport] = useState("");

    const handleTnIdChange = (event) => {
        setTnId(event.target.value);
    };

    const handleReportTrialNetwork = async () => {
        try {
            const token = await getAccessTokenFromLocalStorage();
            const tnReportMarkdown = await getReportTrialNetwork(token, tnId);
            const htmlContent = await convertMarkdownToHtml(tnReportMarkdown);
            setTnReport(htmlContent)
        } catch (error) {
            alert("Error al reportar la red de prueba: " + error.message);
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
        handleTnIdChange,
        handleReportTrialNetwork
    };
};