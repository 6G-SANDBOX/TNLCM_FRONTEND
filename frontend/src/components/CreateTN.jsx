import React, { useState } from "react";
import TopNavigator from "./TopNavigator";
// Importar los componentes
import Elcm from "./library/Elcm";
import Ks8500Runner from "./library/Ks8500_runner";
import LoadcoreAgent from "./library/LoadcoreAgent";
import NokiaRadio from "./library/NokiaRadio";
import Ocf from "./library/Ocf";
import OneKe from "./library/OneKe";
import Open5gs from "./library/Open5gs";
import OpensandGw from "./library/Opensand_gw";
import OpensandSat from "./library/Opensand_sat";
import OpensandSt from "./library/Opensand_st";
import StfUe from "./library/Stf_ue";
import TnBastion from "./library/Tn_Bastion";
import TnInit from "./library/Tn_Init";
import TnVxlan from "./library/Tn_Vxlan";
import Tsn from "./library/Tsn";
import Ueransim from "./library/Ueransim";
import VmKvm from "./library/Vm_Kvm";
import Vnet from "./library/Vnet";
import Xrext from "./library/Xrext";

const CreateTN = () => {
  const [selectedOptionS, setSelectedOptionS] = useState("");
  const [selectedOptionL, setSelectedOptionL] = useState("");
  const [selectedComponent, setSelectedComponent] = useState([]);
  
  const [formData, setFormData] = useState({
    trialNetworkId: "",
    deploymentSite: "",
    libraryReferenceType: "",
    libraryReferenceValue: "",
    sitesReferenceType: "",
    sitesReferenceValue: "",
  });

  // Mantener el estado de los formularios dinámicos para cada componente
  const [componentForms, setComponentForms] = useState({});

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleComponentClick = (label) => {
    const newComponent = {
      id: `${label}-${new Date().getTime()}`,
      label: label
    };
    setSelectedComponent((prevSelected) => [...prevSelected, newComponent]);
    setComponentForms((prevForms) => ({
      ...prevForms,
      [newComponent.id]: {} // Inicializa el estado del formulario vacío para este nuevo componente
    }));
  };

  const handleRemoveComponent = (id) => {
    setSelectedComponent((prevSelected) => prevSelected.filter((component) => component.id !== id));
    setComponentForms((prevForms) => {
      const { [id]: removed, ...rest } = prevForms; // Eliminar el estado del formulario de ese componente
      return rest;
    });
  };

  const handleComponentFormChange = (id, fieldName, value) => {
    setComponentForms((prevForms) => {
      const updatedForm = {
        ...prevForms,
        [id]: {
          ...prevForms[id],
          [fieldName]: value
        }
      };
      return updatedForm;
    });
  };

  const handleDownload = () => {
    const networkData = {
      formData,
      components: selectedComponent.map((component) => {
        // Aquí aseguramos que siempre se tenga data actualizada del formulario
        const componentData = componentForms[component.id] || {};
        return {
          label: component.label,
          data: componentData // Aquí pasamos los datos correctos de cada componente
        };
      })
    };
    // Ahora los datos de cada componente se reflejarán correctamente
  const fileData = JSON.stringify(networkData, null, 2); // Formato JSON bonito
  const blob = new Blob([fileData], { type: "application/json" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "trial_network_data.json"; // Nombre del archivo
  link.click();
  };

  const switchComponent = (component, removeComponent) => {
    switch (component.label) {
      case "tn_init":
        return <TnInit id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} />;
      case "tsn":
        return <Tsn id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} />;
      case "elcm":
        return <Elcm id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} />;
      case "ks8500_runner":
        return <Ks8500Runner id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} />;
      case "loadcore_agent":
        return <LoadcoreAgent id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} />;
      case "nokia_radio":
        return <NokiaRadio id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} />;
      case "ocf":
        return <Ocf id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} />;
      case "oneKE":
        return <OneKe id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} />;
      case "open5gs":
        return <Open5gs id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} />;
      case "opensand_gw":
        return <OpensandGw id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} />;
      case "opensand_sat":
        return <OpensandSat id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} />;
      case "opensand_st":
        return <OpensandSt id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} />;
      case "stf_ue":
        return <StfUe id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} />;
      case "tn_bastion":
        return <TnBastion id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} />;
      case "tn_vxlan":
        return <TnVxlan id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} />;
      case "ueransim":
        return <Ueransim id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} />;
      case "vm_kvm":
        return <VmKvm id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} />;
      case "vnet":
        return <Vnet id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} />;
      case "xrext":
        return <Xrext id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} />;
      default:
        return "Opción no válida: " + component.label;
    }
  };

  return (
    <div className="bg-white font-sans">
      <TopNavigator />
      <div className="flex flex-col lg:flex-row p-4">
        {/* Formulario principal */}
        <div className="lg:w-1/2 space-y-4 justify-center p-4">
          <div>
            <label htmlFor="trial-network-id" className="block text-gray-700 font-medium">
              TRIAL NETWORK ID
            </label>
            <input
              id="trial-network-id"
              name="trialNetworkId"
              type="text"
              placeholder="tn_id"
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
              value={formData.trialNetworkId}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="deployment-site" className="block text-gray-700 font-medium">
              DEPLOYMENT SITE
            </label>
            <input
              id="deployment-site"
              name="deploymentSite"
              type="text"
              placeholder="UMA / ATHENS / BERLIN / OULU..."
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
              value={formData.deploymentSite}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="library-reference-type" className="block text-gray-700 font-medium">
              LIBRARY REFERENCE TYPE
            </label>
            <select
              id="library-reference-type"
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
              value={selectedOptionL}
              onChange={(e) => setSelectedOptionL(e.target.value)}
            >
              <option value="" disabled>-- Select an option --</option>
              <option value="lrt-b">branch</option>
              <option value="lrt-c">commit</option>
              <option value="lrt-t">tag</option>
            </select>
          </div>

          <div>
            <label htmlFor="library-reference-value" className="block text-gray-700 font-medium">
              LIBRARY REFERENCE VALUE
            </label>
            <input
              id="library-reference-value"
              type="text"
              placeholder="github_6g_library_reference_value"
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
              value={formData.libraryReferenceValue}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="sites-reference-type" className="block text-gray-700 font-medium">
              SITES REFERENCE TYPE
            </label>
            <select
              id="sites-reference-type"
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
              value={selectedOptionS}
              onChange={(e) => setSelectedOptionS(e.target.value)}
            >
              <option value="" disabled>-- Select an option --</option>
              <option value="srt-b">branch</option>
              <option value="srt-c">commit</option>
              <option value="srt-t">tag</option>
            </select>
          </div>

          <div>
            <label htmlFor="sites-reference-value" className="block text-gray-700 font-medium">
              SITES REFERENCE VALUE
            </label>
            <input
              id="sites-reference-value"
              type="text"
              placeholder="github_6g_library_reference_value"
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
              value={formData.sitesReferenceValue}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Iconos de Componentes */}
        <div className="lg:w-1/2 grid grid-cols-4 gap-4 mt-8 lg:mt-0">
          {[
            "elcm", "ks8500_runner", "loadcore_agent", "nokia_radio",
            "ocf", "oneKE", "open5gs", "opensand_gw", "opensand_sat",
            "opensand_st", "stf_ue", "tn_bastion", "tn_init", "tn_vxlan",
            "tsn", "ueransim", "vm_kvm", "vnet", "xrext",
          ].map((label, index) => (
            <button
              key={index}
              type="button"
              className="flex flex-col items-center"
              title={label}
              onClick={() => handleComponentClick(label)}
            >
              <img
                src={`/icons/${label}.png`}
                alt={`${label} logo`}
                className="w-20 h-20 rounded-40"
              />
              <span className="text-sm mt-2">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mostrar Componentes Seleccionados */}
      <div className="p-4">
        <h2 className="text-xl font-medium mb-4">Selected components:</h2>
        {selectedComponent.length === 0 ? (
          <p>No components selected yet</p>
        ) : (
          <ul>
            {selectedComponent.map((component) => (
              <li key={component.id} className="flex items-center mb-2">
                {switchComponent(component, handleRemoveComponent)}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex justify-center p-4">
        <button className="bg-purple-600 text-white px-4 py-2 rounded-md" onClick={handleDownload}>
          Download Trial Network Data
        </button>
      </div>
    </div>
  );
};

export default CreateTN;
