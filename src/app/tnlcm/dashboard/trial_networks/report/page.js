"use client"

import CustomForm from "@/components/elements/CustomForm";
import Loader from "@/components/elements/CustomLoader";
import useTrialNetworkReport from "@/hooks/useTrialNetworkReport";

export default function TrialNetworksReportPage() {
    const {
        tnId,
        setTnId,
        tnReport,
        loading,
        handleTrialNetworkReport,
        handleKeyTrialNetworkReportPress
    } = useTrialNetworkReport();

    const inputs = [
        {
            type: "text",
            placeholder: "Enter trial network identifier",
            value: tnId,
            onChange: (e) => setTnId(e.target.value),
            onKeyDown: handleKeyTrialNetworkReportPress,
            className: "input-login-register-verification",
            required: true
        }
    ];

    const buttons = [
        {
            type: "submit",
            className: "button-login-register-verification",
            disabled: loading,
            children: "Report",
        }
    ];

    return (
        <div>
            <h1>Report trial networks</h1>
            {loading ? (
                <Loader />
            ) : (
                <div>
                    <h2>Trial network identifier (tn_id)</h2>
                    <CustomForm
                        onSubmit={handleTrialNetworkReport}
                        loading={loading}
                        containerClassName=""
                        formClassName=""
                        h1=""
                        inputs={inputs}
                        buttons={buttons}
                    />
                    <div dangerouslySetInnerHTML={{ __html: tnReport }} />
                </div>
            )}
        </div>
    );
};