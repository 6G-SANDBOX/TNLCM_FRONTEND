import html2pdf from "html2pdf.js";
import yaml from "js-yaml";
import { marked } from "marked";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coyWithoutShadows } from "react-syntax-highlighter/dist/esm/styles/prism";
import { getTrialNetwork } from "../auxFunc/api";
import { accessVPN } from "../auxFunc/temporalParser";
import CreateTN from "./CreateTN";
import TopNavigator from "./TopNavigator";

function Network() {
  const { id } = useParams(); // We get the `id` parameter from the URL
  const [data, setData] = useState(null);
  const [markdown, setMarkdown] = useState(null);
  const [descriptor, setDescriptor] = useState(null);
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [dictionary, setDictionary] = useState({});
  const [elcm, setElcm] = useState(false);
  const [vpn, setVpn] = useState(false);
  const [showDescriptor, setShowDescriptor] = useState(false);
  const [vpnData, setVpnData] = useState(null);
  const printRef = useRef();

  //UseEffect to fetch the data from the API and search for ELCM and VPN nodes
  useEffect(() => {
    // This function checks if the descriptor contains an ELCM node
    const searchELCM = async (desc) => {
      for (const key in desc.trial_network) {
        const node = desc.trial_network[key];
        if (node.type === "elcm") {
          setElcm(true);
        }
      }
    };
    // This function checks if the descriptor contains a VPN node
    const searchVPN = async (desc) => {
      for (const key in desc.trial_network) {
        const node = desc.trial_network[key];
        if (node.type === "tn_bastion" || node.type === "tn_init") {
          setVpn(true);
        }
      }
    };
    // This function fetches the data from the API
    const getData = async () => {
      try {
        const response = await getTrialNetwork(id);
        setData(response.data);
        setVpnData(await accessVPN(response.data.report));
        // The report only will be available if the state is "activated"
        if (response.data.state === "activated") {
          setMarkdown(response.data.report);
          setDescriptor(yaml.dump(response.data.sorted_descriptor, null, 2));
          // Search for ELCM and VPN nodes in the descriptor
          searchELCM(yaml.dump(response.data.sorted_descriptor, null, 2));
          searchVPN(response.data.sorted_descriptor);
          // Delete non wanted fields from the descriptor
          let tempDictionary = response.data;
          delete tempDictionary.report;
          delete tempDictionary.sorted_descriptor;
          delete tempDictionary.deployed_descriptor;
          delete tempDictionary.raw_descriptor;
          for (const key in tempDictionary.jenkins_deploy.builds) {
            delete tempDictionary.jenkins_deploy?.builds[key]?.build_console;
          }
          setDictionary(tempDictionary);
        }
      } catch (error) {
        const res = error.response?.data?.message || error.message;
        console.error(res);
      }
    };
    // Call the function to fetch data
    getData();
  }, [id]);

  // This function handles the PDF generation
  const handlePDF = async () => {
    const node = printRef.current;
    // Wait for all images to load before generating the PDF
    const images = node.querySelectorAll("img");
    await Promise.all(
      Array.from(images).map(
        (img) =>
          new Promise((resolve, reject) => {
            if (img.complete && img.naturalHeight !== 0) {
              resolve();
            } else {
              img.onload = resolve;
              img.onerror = reject;
            }
          })
      )
    );
    const opt = {
      margin: 10,
      filename: `${data.tn_id}-report.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(node).save();
  };

  const handleBack = () => {
    // Handle back button click
    setShowMarkdown(!showMarkdown);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // This function handles the download of the descriptor
  const handleDescriptor = (yamlString, fileName = "descriptor.yaml") => {
    const blob = new Blob([yamlString], { type: "text/yaml;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    // Create a link element and trigger the download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    // Clear up the URL object and remove the link element
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleVpnData = (filename = `wg-${data.tn_id}.conf`) => {
    const blob = new Blob([vpnData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
  
    // Clear
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      {data === null ? (
        //  If it is null, show a loading gif
        <div className="flex justify-center items-center h-full">
          <img src="loading.gif" alt="Loading..." />
        </div>
      ) : data.state === "created" ? (
        // If the state is "created", let edit the content
        <div>
          <CreateTN savedValues={data} />
        </div>
      ) : (
        <div className="h-full bg-gray-100">
          <TopNavigator />

          {/* Show markdown or main content */}
          {showMarkdown ? (
            <div className="flex flex-col justify-center items-center h-full">
              <div
                className="p-4 prose max-w-none"
                ref={printRef}
                dangerouslySetInnerHTML={{ __html: marked(markdown) }}
              />
              <div className="space-x-8">
                <button
                  onClick={handleBack}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Hide Report
                </button>
                <button
                  onClick={() => handlePDF()}
                  className=" mt-4 px-4 py-2 bg-blue-600 text-white rounded "
                >
                  Download PDF
                </button>
              </div>
            </div>
          ) : (
            <div className="flex ">
              {/* Left Content */}
              <div className="p-6 w-1/2 flex flex-col justify-center space-y-4">
                <SyntaxHighlighter
                  className="overflow-x-auto p-6"
                  language="yaml"
                  style={coyWithoutShadows}
                  customStyle={{ whiteSpace: "pre-wrap" }}
                >
                  {yaml.dump(dictionary)}
                </SyntaxHighlighter>
                {showDescriptor && (
                  <SyntaxHighlighter
                    className="overflow-x-auto p-6"
                    language="yaml"
                    style={coyWithoutShadows}
                    customStyle={{ whiteSpace: "pre-wrap" }}
                  >
                    {descriptor}
                  </SyntaxHighlighter>
                )}
              </div>

              {/* Right Content */}
              {/* TODO Campaign*/}
              <div className="p-16 w-1/2 flex flex-col space-y-16">
                <button
                  onClick={() => setShowMarkdown(!showMarkdown)}
                  className="bg-blue-500 text-white py-6 rounded-xl"
                >
                  Show Report
                </button>
                <button
                  disabled={!elcm}
                  className={
                    !elcm
                      ? "bg-gray-500 text-white py-6 rounded-xl cursor-not-allowed"
                      : "bg-blue-500 text-white py-6 rounded-xl"
                  }
                  onClick={()  => window.open('http://elcm-exp.wygp.6gsandbox.uma.test.internal:5000/auth/login', '_blank')}
                >
                  ELCM GUI
                </button>
                <button
                  disabled={!vpn}
                  className={
                    !vpn
                    ? "bg-gray-500 text-white py-6 rounded-xl cursor-not-allowed"
                    : "bg-blue-500 text-white py-6 rounded-xl"
                  }
                  onClick={() => handleVpnData()}
                >
                  Get VPN Config
                </button>
                <button
                  disabled
                  className={
                    "bg-gray-500 text-white py-6 rounded-xl cursor-not-allowed"
                  }
                >
                  Campaign Manager
                </button>
                <button
                  onClick={() => setShowDescriptor(!showDescriptor)}
                  className="bg-blue-500 text-white py-6 rounded-xl"
                >
                  {showDescriptor ? "Hide" : "Show"} Descriptor
                </button>
                <button
                  onClick={() => handleDescriptor(descriptor)}
                  className="bg-blue-500 text-white py-6 rounded-xl"
                >
                  Download Descriptor
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Network;
