import html2canvas from "html2canvas";
import yaml from 'js-yaml';
import jsPDF from "jspdf";
import { marked } from "marked";
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coyWithoutShadows } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getTrialNetwork } from '../auxFunc/api';
import CreateTN from './CreateTN';
import MarkdownRenderer from './MarkdownRenderer';
import TopNavigator from './TopNavigator';


function Network() {
  const { id } = useParams();  // We get the `id` parameter from the URL
  const [data, setData] = useState(null);
  const [markdown, setMarkdown] = useState(null);
  const [descriptor, setDescriptor] = useState(null);
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [dictionary, setDictionary] = useState({});
  const printRef = useRef();

  useEffect(() => {
    const getData = async () => {
        try {
            const response = await getTrialNetwork(id);
            setData(response.data);
            // The report only will be available if the state is "activated"
            if (response.data.state === "activated") {
              setMarkdown(response.data.report);
              setDescriptor(yaml.dump(response.data.sorted_descriptor,null, 2));
              let tempDictionary = response.data;
              delete tempDictionary.report;
              delete tempDictionary.sorted_descriptor;
              delete tempDictionary.deployed_descriptor;
              delete tempDictionary.raw_descriptor;
              setDictionary(tempDictionary);
            };
        } catch (error) {
            const res= error.response?.data?.message || error.message;
            console.error(res);
        }
    };
    getData();
  }, [id]);

  const handlePDF = async () => {
    const element = printRef.current;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      // TODO Image generates a blank page
      pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("report.pdf");
  };
  
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
        <CreateTN savedValues={data}/>
      </div>
    ) : (
      <div className='h-full bg-gray-100'>
        <TopNavigator />
      
        {/* Show markdown or main content */}
        {showMarkdown ? (
          <div className="flex justify-center items-center h-full">
            <MarkdownRenderer markdown={markdown} />
          <div className="p-4">
            <div className="prose max-w-none" ref={printRef} dangerouslySetInnerHTML={{ __html: marked(markdown) }} />
              <button onClick={() =>handlePDF()} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
                Download PDF
              </button>
            </div>
          </div>
        )
        :(
          <div className="flex items-center ">

            {/* Left Content */}
            <div className="p-6 w-1/2 flex flex-col justify-center space-y-4">
                <SyntaxHighlighter
                  className= "overflow-x-auto p-6"
                  language="yaml"
                  style={coyWithoutShadows}
                  customStyle={{ whiteSpace: 'pre-wrap' }}
                >
                  {yaml.dump(dictionary)}
                </SyntaxHighlighter>
                <SyntaxHighlighter
                  className= "overflow-x-auto p-6"
                  language="yaml"
                  style={coyWithoutShadows}
                  customStyle={{ whiteSpace: 'pre-wrap' }}
                >
                  {descriptor}
                </SyntaxHighlighter>
            </div>

            {/* Right Content */}
            <div className="p-20 w-1/2 flex flex-col justify-center space-y-20">
              <button onClick={() => setShowMarkdown(!showMarkdown)} className="bg-blue-500 text-white py-6 rounded-xl">
                Show Report
              </button>
              <button className="bg-blue-500 text-white py-6 rounded-xl">
                ELCM GUI
              </button>
              <button onClick={() => handleDescriptor(descriptor)} className="bg-blue-500 text-white py-6 rounded-xl">
                Download Descriptor
              </button>
              <button className="bg-blue-500 text-white py-6 rounded-xl">
                Start VPN
              </button>
              <button className="bg-blue-500 text-white py-6 rounded-xl">
                Campaign Manager
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
