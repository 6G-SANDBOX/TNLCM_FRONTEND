"use client"

import markdownit from "markdown-it";
import CustomForm from "@/components/elements/CustomForm";
import CustomLoader from "@/components/elements/CustomLoader";
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

    const md = markdownit({
        // Enable HTML tags in source
        html:         true,
      
        // Use '/' to close single tags (<br />).
        // This is only for full CommonMark compatibility.
        xhtmlOut:     true,
      
        // Convert '\n' in paragraphs into <br>
        breaks:       true,
      
        // CSS language prefix for fenced blocks. Can be
        // useful for external highlighters.
        langPrefix:   'language-',
      
        // Autoconvert URL-like text to links
        linkify:      true,
      
        // Enable some language-neutral replacement + quotes beautification
        // For the full list of replacements, see https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/replacements.mjs
        typographer:  true,
      
        // Double + single quotes replacement pairs, when typographer enabled,
        // and smartquotes on. Could be either a String or an Array.
        //
        // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
        // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
        quotes: '“”‘’',
      
        // Highlighter function. Should return escaped HTML,
        // or '' if the source string is not changed and should be escaped externally.
        // If result starts with <pre... internal wrapper is skipped.
        highlight: function (/*str, lang*/) { return ''; }
    });

    return (
        <div>
            <h1>Report trial networks</h1>
            {loading ? (
                <CustomLoader />
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
                    <div dangerouslySetInnerHTML={{ __html: md.render(tnReport) }} />
                </div>
            )}
        </div>
    );
};