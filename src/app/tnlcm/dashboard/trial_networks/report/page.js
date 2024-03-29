'use client'

import { useState } from 'react';
import { remark } from 'remark';
import html from 'remark-html';
import Input from '@/app/components/Input';
import Button from '@/app/components/Button';
import { getAccessTokenFromLocalStorage } from '@/app/lib/jwtHandler';
import { getReportTrialNetwork } from '@/app/lib/apiHandler';

export default function ReportPage() {

    const [tnId, setTnId] = useState('');
    const [tnReport, setTnReport] = useState('');

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
            alert(e);
        }
    };

    const convertMarkdownToHtml = async (markdown) => {
        const processedContent = await remark().use(html).process(markdown);
        const contentHtml = processedContent.toString();
        return contentHtml;
    };

    return (
        <div>
            <h1>Report Trial Networks</h1>
            <h2>Trial Network Identifier</h2>
            <Input
                type="text"
                id="tnId"
                placeholder="Enter trial network identifier"
                value={tnId}
                onChange={handleTnIdChange}
                className="input-login-register"
                required={true}
            />
            <Button 
                type="submit"
                className="button-login-register"
                onClick={handleReportTrialNetwork}
            >
                Report
            </Button>
            <div dangerouslySetInnerHTML={{ __html: tnReport }} />
        </div>
    )
}