"use client"

import Input from "@/components/elements/Input";
import Button from "@/components/elements/Button";
import Loader from "@/components/elements/Loader";
import useReport from "@/hooks/useReport";

export default function ReportPage() {
    const {
        tnId,
        setTnId,
        tnReport,
        loading,
        handleReportTrialNetwork
    } = useReport();

    return (
        <div>
            <h1>Report Trial Networks</h1>
            {loading ? (
                <Loader />
            ) : (
                <div>
                    <h2>Trial Network Identifier</h2>
                    <Input
                        type="text"
                        id="tnId"
                        placeholder="Enter trial network identifier"
                        value={tnId}
                        onChange={(e) => setTnId(e.target.value)}
                        className="input-login-register"
                        required={true}
                    />
                    <Button 
                        type="button"
                        className="button-login-register"
                        onClick={handleReportTrialNetwork}
                    >
                        Report
                </Button>
                    <div dangerouslySetInnerHTML={{ __html: tnReport }} />
                </div>
            )}
        </div>
    );
};