import React, { useCallback, useState } from "react";
import TopNavigator from "./TopNavigator";
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
  const [selectedComponent, setSelectedComponent] = useState([]);
  const [formData, setFormData] = useState({
    trialNetworkId: "",
    deploymentSite: "",
    libraryReferenceType: "",
    libraryReferenceValue: "",
    sitesReferenceType: "",
    sitesReferenceValue: "",
  });

  const [componentForms, setComponentForms] = useState({});
  const [errors, setErrors] = useState({});
  const [Cerrors,SetCerrors] = useState({});
  const [childError,setChildError] = useState({});

  const filterVnetOrTnVxlanComponents = useCallback(() => {
    const filteredComponents = selectedComponent.filter((component) =>
      component.label.toLowerCase().includes('vnet') || component.label.toLowerCase().includes('tn_vxlan')
    );
  
    // Devuelve una lista en formato "label-name"
    return filteredComponents.map((component) => {
      const componentForm = componentForms[component.id] || {};
      return componentForm.name ? `${component.label}-${componentForm.name}` : `${component.label}`;
    });
  }, [selectedComponent, componentForms]);
  
  const filterVnetComponents = useCallback(() => {
    const filteredComponents = selectedComponent.filter((component) =>
      component.label.toLowerCase().includes('vnet')
    );
  
    // Devuelve una lista en formato "label-name"
    return filteredComponents.map((component) => {
      const componentForm = componentForms[component.id] || {};
      return componentForm.name ? `${component.label}-${componentForm.name}` : `${component.label}`;
    });
  }, [selectedComponent, componentForms]);
  
  const filterOneKEComponents = useCallback(() => {
    const filteredComponents = selectedComponent.filter((component) =>
      component.label.toLowerCase().includes('oneke')
    );
  
    // Devuelve una lista en formato "label-name"
    return filteredComponents.map((component) => {
      const componentForm = componentForms[component.id] || {};
      return componentForm.name ? `${component.label}-${componentForm.name}` : `${component.label}`;
    });
  }, [selectedComponent, componentForms]);

  const filterOpen5GsComponents = useCallback(() => {
    const filteredComponents = selectedComponent.filter((component) =>
      component.label.toLowerCase().includes('open5gs')
    );
  
    // Devuelve una lista en formato "label-name"
    return filteredComponents.map((component) => {
      const componentForm = componentForms[component.id] || {};
      return componentForm.name ? `${component.label}-${componentForm.name}` : `${component.label}`;
    });
  }, [selectedComponent, componentForms]);

  const filterUeransimComponents = useCallback(() => {
    const filteredComponents = selectedComponent.filter((component) =>
      component.label.toLowerCase().includes('ueransim')
    );
  
    // Devuelve una lista en formato "label-name"
    return filteredComponents.map((component) => {
      const componentForm = componentForms[component.id] || {};
      return componentForm.name ? `${component.label}-${componentForm.name}` : `${component.label}`;
    });
  }, [selectedComponent, componentForms]);


  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key].trim()) {
        newErrors[key] = "This field is required";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const validateComps = () => {
  const requi = getRequiredFields();
  let newErrors = {}; // Objeto temporal para acumular los errores

  requi.forEach((component) => {
    const matchedComponent = selectedComponent.find(
      (comp) => comp.label === component.label &&
                (componentForms[comp.id]?.name === component.name)
    );

    if (matchedComponent) {
      const componentData = componentForms[matchedComponent.id] || {};

      component.requiredFields.forEach((field) => {
        if (
          !componentData.hasOwnProperty(field) || // No existe el campo
          componentData[field] === "" ||         // Está vacío
          componentData[field] === null||
          (Array.isArray(componentData[field]) && componentData[field].length === 0)
          // Es null
        ) {
          // Agregar el error al objeto de errores
          if (!newErrors[matchedComponent.id]) {
            newErrors[matchedComponent.id] = {};
          }
          newErrors[matchedComponent.id][field] = `The field "${field}" is required for "${component.label}"`;
        }
      });
    }
  });

  SetCerrors(newErrors); // Actualizar el estado de errores con los nuevos errores
  return Object.keys(newErrors).length === 0;
};

  
  const getRequiredFields = () => {
    return selectedComponent.map((component) => {
      const componentData = componentForms[component.id] || {};
      return {
        label: component.label,
        name: componentData.name,
        requiredFields: componentData.required || [], // Obtiene los campos requeridos para el componente
      };
    });
  };
  

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleComponentClick = (label) => {
    // Define the components that should only have one instance
    const restrictedComponents = ["tn_bastion", "tn_init", "tn_vxlan", "tsn"];

    // Check if the clicked component is in the restricted list and if it's already selected
    if (restrictedComponents.includes(label)) {
      const isAlreadySelected = selectedComponent.some((component) => component.label === label);
      if (isAlreadySelected) {
        // If already selected, don't add another one
        alert(`${label} is already selected. Only one instance of this component is allowed.`);
        return;
      }
    }

    const newComponent = {
      id: `${label}-${new Date().getTime()}`,
      label: label,
    };

    setSelectedComponent((prevSelected) => [...prevSelected, newComponent]);
    setComponentForms((prevForms) => ({
      ...prevForms,
      [newComponent.id]: {},
    }));
  };

  const handleRemoveComponent = (id) => {
    setSelectedComponent((prevSelected) => prevSelected.filter((component) => component.id !== id));
    setComponentForms((prevForms) => {
      const { [id]: removed, ...rest } = prevForms;
      return rest;
    });
  };

  const handleChildError = useCallback((id, field, message) => {
    setChildError((prevErrors) => ({
      ...prevErrors,
      [id]: {
        ...prevErrors[id],
        [field]: message,
      },
    }));
  }, []);


  const handleComponentFormChange = useCallback((id, fieldName, value) => {
    setComponentForms((prevForms) => {
      const updatedForm = {
        ...prevForms,
        [id]: {
          ...prevForms[id],
          [fieldName]: value,
        },
      };
      return updatedForm;
    });
  }, []);

  const isChildErrorEmpty = (childError) => {
    const valid= Object.keys(childError).length === 0 ||
    Object.values(childError).every(value =>
      value && Object.values(value).every(v => v === null)
    );
    if (!valid){
      return Object.keys(childError)[0];
    } else {
      return  valid;
    }
  };
  
  const validateFields = () => {
    const isBoolean = (value) => typeof value === 'boolean';
    const v1= !validateComps();
    const v2= !validateForm();
    const v3 = isBoolean(isChildErrorEmpty(childError))
              ? !isChildErrorEmpty(childError)
              : isChildErrorEmpty(childError);

    if (v1 || v2 ) {
      window.scrollTo({
          top: 0,
          behavior: "smooth"
      });
      return true;
    } else if (!isBoolean(v3)){
        const scroll=document.getElementById(v3);
        window.scrollTo({
          top: scroll.offsetTop,
          behavior: "smooth"
        });
        return true;
    } else{
      return false;
    }
  }

  const handleDownload = () => {
    if (validateFields()) {
      return;
    }
      
    const networkData = {
      formData,
      components: selectedComponent.map((component) => {
        const componentData = componentForms[component.id] || {};
        
        // Concatenate label and name when generating the file
        const labelWithName = componentForms[component.id]?.name
          ? `${component.label}-${componentForms[component.id]?.name}`
          : component.label;
  
        return {
          label: labelWithName, // Use label-name format for the download
          data: componentData,
        };
      }),
    };
    //TODO CONVERTIR A YAML Y MANDAR LA PETICION
    const fileData = JSON.stringify(networkData, null, 2);
    const blob = new Blob([fileData], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "trial_network_data.json";
    link.click();
  };
  

  const switchComponent = (component, removeComponent, handleComponentFormChange, handleChildError) => {
    switch (component.label) {
      case "tn_init":
        return <TnInit id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} whenError={handleChildError}/>;
      case "tsn":
        return <Tsn id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} />;
      case "elcm":
        return <Elcm id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} />;
      case "ks8500_runner":
        const listKS8 =filterVnetOrTnVxlanComponents(); // Aquí puedes generar la lista de manera dinámica
        return <Ks8500Runner id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} list={listKS8} whenError={handleChildError}/>;
      case "loadcore_agent":
        const listLCA= filterVnetOrTnVxlanComponents();
        return <LoadcoreAgent id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} list={listLCA} whenError={handleChildError}/>;
      case "nokia_radio":
        const listNokia=filterOneKEComponents();
        return <NokiaRadio id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} list={listNokia} whenError={handleChildError}/>;
      case "ocf":
        const listOCF=filterOneKEComponents();
        return <Ocf id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} list={listOCF} whenError={handleChildError}/>;
      case "oneKE":
        const listO1=filterVnetOrTnVxlanComponents();
        const listO2=filterVnetComponents();
        return <OneKe id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} list1={listO1} list2={listO2} whenError={handleChildError}/>;
      case "open5gs":
        const listO5=filterOneKEComponents();
        return <Open5gs id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange}  list={listO5} whenError={handleChildError}/>;
      case "opensand_gw":
        return <OpensandGw id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} />;
      case "opensand_sat":
        return <OpensandSat id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} />;
      case "opensand_st":
        return <OpensandSt id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} />;
      case "stf_ue":
        return <StfUe id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} whenError={handleChildError}/>;
      case "tn_bastion":
        return <TnBastion id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} />;
      case "tn_vxlan":
        return <TnVxlan id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} whenError={handleChildError}/>;
      case "ueransim":
        const listUE1=filterVnetOrTnVxlanComponents();
        const listUE2=filterOpen5GsComponents();
        const listUE3=filterUeransimComponents();
        return <Ueransim id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} list1={listUE1} list2={listUE2} list3={listUE3} whenError={handleChildError}/>;
      case "vm_kvm":
        const listVK=filterVnetOrTnVxlanComponents();
        return <VmKvm id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} list={listVK}/>;
      case "vnet":
        return <Vnet id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} whenError={handleChildError}/>;
      case "xrext":
        const listXR=filterVnetOrTnVxlanComponents();
        return <Xrext id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} list={listXR}/>;
      default:
        return "No valid option selected: " + component.label;
    }
  };

  return (
    <div className="bg-white font-sans">
      <TopNavigator />
      <div className="flex flex-col lg:flex-row p-4">
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
              className={`w-full border p-2 mt-1 rounded-md ${errors.trialNetworkId ? "border-red-500" : "border-gray-300"}`}
              value={formData.trialNetworkId}
              onChange={handleInputChange}
            />
            {errors.trialNetworkId && <p className="text-red-500 text-sm mt-1">{errors.trialNetworkId}</p>}
          </div>

          <div>
            <label htmlFor="deployment-site" className="block text-gray-700 font-medium">
              DEPLOYMENT SITE
            </label>
            {/* TODO ¿Hacer como select? */}
            <input
              id="deployment-site"
              name="deploymentSite"
              type="text"
              placeholder="UMA / ATHENS / BERLIN / OULU..."
              className={`w-full border p-2 mt-1 rounded-md ${errors.deploymentSite ? "border-red-500" : "border-gray-300"}`}
              value={formData.deploymentSite}
              onChange={handleInputChange}
            />
            {errors.deploymentSite && <p className="text-red-500 text-sm mt-1">{errors.deploymentSite}</p>}
          </div>

          <div>
            <label htmlFor="library-reference-type" className="block text-gray-700 font-medium">
              LIBRARY REFERENCE TYPE
            </label>
            <select
              id="library-reference-type"
              name="libraryReferenceType"
              className={`w-full border p-2 mt-1 rounded-md ${errors.libraryReferenceType ? "border-red-500" : "border-gray-300"}`}
              value={formData.libraryReferenceType}
              onChange={handleInputChange}
            >
              <option value="" disabled>-- Select an option --</option>
              <option value="branch">branch</option>
              <option value="commit">commit</option>
              <option value="tag">tag</option>
            </select>
            {errors.libraryReferenceType && <p className="text-red-500 text-sm mt-1">{errors.libraryReferenceType}</p>}
          </div>

          <div>
            <label htmlFor="library-reference-value" className="block text-gray-700 font-medium">
              LIBRARY REFERENCE VALUE
            </label>
            <input
              id="library-reference-value"
              name="libraryReferenceValue"
              type="text"
              placeholder="github_6g_library_reference_value"
              className={`w-full border p-2 mt-1 rounded-md ${errors.libraryReferenceValue ? "border-red-500" : "border-gray-300"}`}
              value={formData.libraryReferenceValue}
              onChange={handleInputChange}
            />
            {errors.libraryReferenceValue && <p className="text-red-500 text-sm mt-1">{errors.libraryReferenceValue}</p>}
          </div>

          <div>
            <label htmlFor="sites-reference-type" className="block text-gray-700 font-medium">
              SITES REFERENCE TYPE
            </label>
            <select
              id="sites-reference-type"
              name="sitesReferenceType"
              className={`w-full border p-2 mt-1 rounded-md ${errors.sitesReferenceType ? "border-red-500" : "border-gray-300"}`}
              value={formData.sitesReferenceType}
              onChange={handleInputChange}
            >
              <option value="" disabled>-- Select an option --</option>
              <option value="branch">branch</option>
              <option value="commit">commit</option>
              <option value="tag">tag</option>
            </select>
            {errors.sitesReferenceType && <p className="text-red-500 text-sm mt-1">{errors.sitesReferenceType}</p>}
          </div>

          <div>
            <label htmlFor="sites-reference-value" className="block text-gray-700 font-medium">
              SITES REFERENCE VALUE
            </label>
            <input
              id="sites-reference-value"
              name="sitesReferenceValue"
              type="text"
              placeholder="github_6g_library_reference_value"
              className={`w-full border p-2 mt-1 rounded-md ${errors.sitesReferenceValue ? "border-red-500" : "border-gray-300"}`}
              value={formData.sitesReferenceValue}
              onChange={handleInputChange}
            />
            {errors.sitesReferenceValue && <p className="text-red-500 text-sm mt-1">{errors.sitesReferenceValue}</p>}
          </div>
        </div>

        <div className="lg:w-1/2 grid grid-cols-4 gap-4 mt-8 lg:mt-0">
          {["elcm", "ks8500_runner", "loadcore_agent", "nokia_radio", "ocf", "oneKE", "open5gs", "opensand_gw", "opensand_sat", "opensand_st", "stf_ue", "tn_bastion", "tn_init", "tn_vxlan", "tsn", "ueransim", "vm_kvm", "vnet", "xrext"].map((label, index) => (
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
              />
              <span className="text-sm mt-2">{label}</span>
            </button>
          ))}
        </div>

        </div>
        
        {Object.keys(Cerrors).length > 0 && (
          <div  id="Cerror" className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
            <h3 className="font-bold text-lg">Components errors:</h3>
            <ul className="list-disc pl-5">
              {Object.entries(Cerrors).map(([componentId, fields]) => (
                <li key={componentId}>
                  <strong>Component {componentId}:</strong>
                  <ul className="list-disc pl-5">
                    {Object.entries(fields).map(([field, message]) => (
                      <li key={field} className="text-sm">{message}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        )}


      <div className="p-4">
        {selectedComponent.map((component) => (
          <div id={component.id}  key={component.id} className="border rounded p-4 mb-4">
            {switchComponent(component, handleRemoveComponent, handleComponentFormChange, handleChildError)}
          </div>
        ))}
      </div>
      
      <div className="p-4 flex justify-center items-center">
      <button
        type="button"
        className="bg-purple-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-purple-500"
        onClick={handleDownload}
      >
        Download Configuration
      </button>
    </div>
    </div>
  );
};

export default CreateTN;

