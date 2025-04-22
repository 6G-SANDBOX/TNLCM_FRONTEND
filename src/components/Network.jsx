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
  const [elcm, setElcm] = useState(false);
  const [vpn , setVpn] = useState(false);
  const printRef = useRef();

  useEffect(() => {
    // This function checks if the descriptor contains an ELCM node
    const searchELCM = async (desc) => {
      for (const key in desc.trial_network) {
        const node = desc.trial_network[key];
        if (node.type === 'elcm') {
          setElcm(true);
        }
      }
    }
    // This function checks if the descriptor contains a VPN node
    const searchVPN = async (desc) => {
      for (const key in desc.trial_network) {
        const node = desc.trial_network[key];
        if (node.type === 'tn_bastion' || node.type === 'tn_init') {
          setVpn(true);
        }
      }
    }
    // This function fetches the data from the API
    const getData = async () => {
        try {
            const response = await getTrialNetwork(id);
            setData(response.data);
            // The report only will be available if the state is "activated"
            if (response.data.state === "activated") {
              setMarkdown(response.data.report);
              setDescriptor(yaml.dump(response.data.sorted_descriptor,null, 2));
              // Search for ELCM and VPN nodes in the descriptor
              searchELCM(yaml.dump(response.data.sorted_descriptor,null, 2));
              searchVPN(response.data.sorted_descriptor);
              // Delete non wanted fields from the descriptor
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
    // Call the function to fetch data
    getData();
  }, [id]);

  // This function handles the PDF generation
  // TODO fix
  const handlePDF = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
  
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
  
    const margin = 10; // margen en mm
    const usableWidth = pageWidth - margin * 2; // ancho usable considerando márgenes
  
    const imgProps = pdf.getImageProperties(imgData); // Propiedades de la imagen generada
    const totalImgHeight = (imgProps.height * usableWidth) / imgProps.width; // Altura total de la imagen ajustada al ancho de la página
  
    let heightLeft = totalImgHeight; // Altura restante de la imagen que falta por agregar
    let position = margin;
  
    // Primera página: agregar la imagen hasta que se llene la página
    const firstPageHeight = pageHeight - margin * 2; // Altura disponible en la primera página
    pdf.addImage(imgData, "PNG", margin, position, usableWidth, firstPageHeight);
    heightLeft -= firstPageHeight; // Restamos la altura de la parte agregada
  
    // Agregar más páginas si la imagen sigue siendo más grande que la altura de la primera página
    while (heightLeft > 0) {
      pdf.addPage();
  
      // Solo agregar la siguiente parte de la imagen
      position = margin; // La posición comienza en el margen superior de cada página
      const sliceHeight = pageHeight - margin * 2; // Calculamos la altura de la parte de la imagen que cabe en la página
  
      // Agregar la siguiente parte de la imagen
      pdf.addImage(imgData, "PNG", margin, position, usableWidth, sliceHeight);
  
      heightLeft -= sliceHeight; // Restamos la altura de la parte que hemos agregado
    }
  
    // Guardar el archivo PDF
    pdf.save("report.pdf");
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
              <button disabled={!elcm} className={!elcm ? "bg-gray-500 text-white py-6 rounded-xl cursor-not-allowed" : "bg-blue-500 text-white py-6 rounded-xl"}>
                ELCM GUI
              </button>
              <button onClick={() => handleDescriptor(descriptor)} className="bg-blue-500 text-white py-6 rounded-xl">
                Download Descriptor
              </button>
              <button disabled={!vpn} className={!vpn ? "bg-gray-500 text-white py-6 rounded-xl cursor-not-allowed" : "bg-blue-500 text-white py-6 rounded-xl"}>
                Start VPN
              </button>
              <button  className="bg-blue-500 text-white py-6 rounded-xl">
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
