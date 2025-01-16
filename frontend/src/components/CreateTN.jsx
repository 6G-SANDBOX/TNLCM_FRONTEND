import React, { useState } from "react";
import TopNavigator from "./TopNavigator";

const CreateTN = () => {
    const [selectedOptionL, setSelectedOptionL] = useState(""); // Valor por defecto vacío
    const handleChangeL = (event) => {
        setSelectedOptionL(event.target.value); // Actualizar el estado con la opción seleccionada
    }

    const [selectedOptionS, setSelectedOptionS] = useState(""); // Valor por defecto vacío
    const handleChangeS = (event) => {
        setSelectedOptionS(event.target.value); // Actualizar el estado con la opción seleccionada
    }

  return (
    //
    <div className="bg-white font-sans">
      {/* Header */}
      <TopNavigator />

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row p-4">
        {/* Left Form Section */}
        <div className="lg:w-1/2 space-y-4">
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
            "VXLAN",
            "oneKE",
            "Bastion",
            "KVM",
            "Open5GS",
            "Uerasim",
            "TSN",
            "Nokia Radio",
            "UE-PHONE",
            "OCF",
            "ELCM",
            "KS8500_Runner",
            "LoadCore_Agent",
            "OpenSand_GW",
            "OpenSand_SAT",
            "OpenSand_ST",
            "STF_UE",
            "VNET",
            "XRext",
            "INIT",
        ].map((label, index) => (
            <button
            key={index}
            type="button"
            className="flex flex-col items-center"
            title={label}
            >
            <img
                src={`/icons/${label.toLowerCase()}.png`}
                alt={`${label} logo`}
                className="w-20 h-20 rounded-40"
            />
            <span className="text-sm mt-2">{label.toLowerCase()}</span>
            </button>
        ))}
        </div>
      </div>
      <div className="flex justify-center p-4">
        <button className="bg-purple-600 text-white px-4 py-2 rounded-md">
          Create Trial Network
          {/* TODO Devolver cada componente dependiendo de los clicks en las fotos*/}
        </button>
        </div>
    </div>
  );
};

export default CreateTN;
