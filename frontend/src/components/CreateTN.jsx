import React, { useState } from "react";
import Elcm from "./Elcm";
import Ks8500Runner from "./Ks8500_runner";
import TnInit from "./TnInit";
import TopNavigator from "./TopNavigator";

const CreateTN = () => {
  const [selectedOptionS, setSelectedOptionS] = useState(""); // Valor por defecto vacío
  const [selectedOptionL, setSelectedOptionL] = useState(""); // Valor por defecto vacío
  const [selectedComponent, setSelectedComponent] = useState([]); // Valor por defecto vacío

  const handleChangeL = (event) => {
      setSelectedOptionL(event.target.value); // Actualizar el estado con la opción seleccionada
  }

  const handleChangeS = (event) => {
      setSelectedOptionS(event.target.value); // Actualizar el estado con la opción seleccionada
  }

  const handleComponentClick = async (label) => {
    await setSelectedComponent((prevSelected) => {
      if (prevSelected.includes(label)) {
        // Si el label ya está en el estado, lo elimina
        return prevSelected.filter((component) => component !== label);
      } else {
        // Si no está, lo añade
        return [...prevSelected, label];
      }

    });
  }
  //TODO poner todos los componentes
  const switchComponent = (input) => {
    switch (input) {
      case "tn_init":
        return <TnInit/>;
      case "elcm":
        return  <Elcm/>;
      case "ks8500_runner":
        return <Ks8500Runner/>;
      default:
        return "Opción no válida: " + input;
    }
  };



  return (
    //
    <div className="bg-white font-sans">
      {/* Header */}
      <TopNavigator />

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row p-4 ">
        {/* Left Form Section */}
        <div className="lg:w-1/2 space-y-4 justify-center p-4 ">
          {/* Trial Network ID */}
          <div>
            <label
              htmlFor="trial-network-id"
              className="block text-gray-700 font-medium"
            >
              TRIAL NETWORK ID
            </label>
            <input
              id="trial-network-id"
              type="text"
              placeholder="tn_id"
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
            />
          </div>

          {/* Deployment Site */}
          <div>
            <label
              htmlFor="deployment-site"
              className="block text-gray-700 font-medium"
            >
              DEPLOYMENT SITE
            </label>
            <input
              id="deployment-site"
              type="text"
              placeholder="UMA / ATHENS / BERLIN / OULU..."
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
            />
          </div>

          {/* Library Reference Type */}
          <div>
            <label
              htmlFor="library-reference-type"
              className="block text-gray-700 font-medium"
            >
              LIBRARY REFERENCE TYPE
            </label>
            <select
              id="library-reference-type"
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
              value={selectedOptionL}
              onChange={handleChangeL}
            >
              <option value="" disabled>-- Select an option --</option>
              <option value="lrt-b">branch</option>
              <option value="lrt-c">commit</option>
              <option value="lrt-t">tag</option>
            </select>
          </div>

          {/* Library Reference Value */}
          <div>
            <label
              htmlFor="library-reference-value"
              className="block text-gray-700 font-medium"
            >
              LIBRARY REFERENCE VALUE
            </label>
            <input
              id="library-reference-value"
              type="text"
              placeholder="github_6g_library_reference_value"
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
            />
          </div>
          {/* Sites Reference Type */}
          <div>
            <label
              htmlFor="sites-reference-type"
              className="block text-gray-700 font-medium"
            >
              SITES REFERENCE TYPE
            </label>
            <select
              id="sites-reference-type"
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
              value={selectedOptionS}
              onChange={handleChangeS}
            >
              <option value="" disabled>-- Select an option --</option>
              <option value="srt-b">branch</option>
              <option value="srt-c">commit</option>
              <option value="srt-t">tag</option>
            </select>
          </div>

          {/* Sites Reference Value */}
          <div>
            <label
              htmlFor="sites-reference-value"
              className="block text-gray-700 font-medium"
            >
              SITES REFERENCE VALUE
            </label>
            <input
              id="sites-reference-value"
              type="text"
              placeholder="github_6g_library_reference_value"
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
            />
          </div>
        </div>

        {/* Right Icons Section */}
        <div className="lg:w-1/2 grid grid-cols-4 gap-4 mt-8 lg:mt-0">
        {[
            "elcm",
            "ks8500_runner",
            "loadcore_agent",
            "nokia_radio",
            "ocf",
            "oneKE",
            "open5gs",
            "opensand_gw",
            "opensand_sat",
            "opensand_st",
            "stf_ue",
            "tn_bastion",
            "tn_init",
            "tn_vxlan",
            "tsn",
            "ueransim",
            "vm_kvm",
            "vnet",
            "xrext",
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
      <div className="p-4">
        <h2 className="text-xl font-medium mb-4">Selected components:</h2>
        {selectedComponent.length === 0 ? (
          <p>No components selected yet</p>
        ) : (
          <ul>
            {selectedComponent.map((component, index) => (
              <li key={index} className="flex items-center mb-2">

                 <span className="mr-2">{switchComponent(component)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex justify-center p-4">
        <button className="bg-purple-600 text-white px-4 py-2 rounded-md">
          Create Trial Network
        </button>
        </div>
    </div>
  );
};

export default CreateTN;
