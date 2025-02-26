import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { getAccessTokenFromSessionStorage } from "../auxFunc/jwt";
import convertJsonToYaml from '../auxFunc/yamlHandler';
import TopNavigator from "./TopNavigator";
import BerlinRan from "./library/Berlin_ran";
import Elcm from "./library/Elcm";
import IswirelessRadio from "./library/Iswireless_radio";
import IxcEndpoint from "./library/Ixc_endpoint";
import Ks8500Runner from "./library/Ks8500_runner";
import LoadcoreAgent from "./library/LoadcoreAgent";
import NokiaRadio from "./library/NokiaRadio";
import Ocf from "./library/Ocf";
import OneKe from "./library/OneKe";
import Open5gcoreVM from "./library/Open5gcore_vm";
import Open5gsK8S from "./library/Open5gs_k8s";
import OpensandGw from "./library/Opensand_gw";
import OpensandSat from "./library/Opensand_sat";
import OpensandSt from "./library/Opensand_st";
import StfUe from "./library/Stf_ue";
import TnBastion from "./library/Tn_Bastion";
import TnInit from "./library/Tn_Init";
import TnVxlan from "./library/Tn_Vxlan";
import Tsn from "./library/Tsn";
import Ueransim from "./library/Ueransim";
import UpfP4Sw from "./library/Upf_p4_sw";
import VmKvm from "./library/Vm_Kvm";
import Vnet from "./library/Vnet";
import Xrext from "./library/Xrext";
import NvoModal from "./nvoModal";

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
  const [allComp, setAllComp] = useState([]);
  const [componentForms, setComponentForms] = useState({});
  const [errors, setErrors] = useState({});
  const [Cerrors,SetCerrors] = useState({});
  const [childError,setChildError] = useState({});
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
        const urlBase =process.env.REACT_APP_ENDPOINT;
        const endpoint = "/tnlcm/library/components/";

        try {
            const response = await fetch(`${urlBase}${endpoint}`);
            if (!response.ok) {
                throw new Error(`Error while retrieving all components: ${response.status}`);
            }
            const result = await response.json();
            setAllComp(result.components);
        } catch (error) {
            console.error("Error doing the fetch:", error);
        }
    };

    fetchData();
}, []);

  const filterVnetOrTnVxlanComponents = useCallback(() => {
    const filteredComponents = selectedComponent.filter((component) =>
      component.label.toLowerCase().includes('vnet') || component.label.toLowerCase().includes('tn_vxlan') || component.label.toLowerCase().includes('tn_init')
    );
  
    // Return a list in format "label-name"
    return filteredComponents.map((component) => {
      const componentForm = componentForms[component.id] || {};
      return componentForm.name ? `${component.label}-${componentForm.name}` : `${component.label}`;
    });
  }, [selectedComponent, componentForms]);
  
  const filterVnetComponents = useCallback(() => {
    const filteredComponents = selectedComponent.filter((component) =>
      component.label.toLowerCase().includes('vnet')
    );
  
    // Return a list in format "label-name"
    return filteredComponents.map((component) => {
      const componentForm = componentForms[component.id] || {};
      return componentForm.name ? `${component.label}-${componentForm.name}` : `${component.label}`;
    });
  }, [selectedComponent, componentForms]);
  
  const filterOneKEComponents = useCallback(() => {
    const filteredComponents = selectedComponent.filter((component) =>
      component.label.toLowerCase().includes('oneke')
    );
  
    // Return a list in format "label-name"
    return filteredComponents.map((component) => {
      const componentForm = componentForms[component.id] || {};
      return componentForm.name ? `${component.label}-${componentForm.name}` : `${component.label}`;
    });
  }, [selectedComponent, componentForms]);

  const filterOpen5GsComponents = useCallback(() => {
    const filteredComponents = selectedComponent.filter((component) =>
      component.label.toLowerCase().includes('open5gs')
    );
  
    // Return a list in format "label-name"
    return filteredComponents.map((component) => {
      const componentForm = componentForms[component.id] || {};
      return componentForm.name ? `${component.label}-${componentForm.name}` : `${component.label}`;
    });
  }, [selectedComponent, componentForms]);

  const filterO5gsVMorK8SComponents = useCallback(() => {
    const filteredComponents = selectedComponent.filter((component) =>
      component.label.toLowerCase().includes('open5gs_vm') || component.label.toLowerCase().includes('open5gs_k8s')
    );
    // Return a list in format "label-name"
    return filteredComponents.map((component) => {
      const componentForm = componentForms[component.id] || {};
      return componentForm.name ? `${component.label}-${componentForm.name}` : `${component.label}`;
    });
  }, [selectedComponent, componentForms]);

  const filterO5All = useCallback(() => {
    const filteredComponents = selectedComponent.filter((component) =>
      component.label.toLowerCase().includes('open5gs_vm') || component.label.toLowerCase().includes('open5gs_k8s') ||
      component.label.toLowerCase().includes("open5gcore_vm")
    );
    // Return a list in format "label-name"
    return filteredComponents.map((component) => {
      const componentForm = componentForms[component.id] || {};
      return componentForm.name ? `${component.label}-${componentForm.name}` : `${component.label}`;
    });
  }, [selectedComponent, componentForms]);

  const filterUeransimComponents = useCallback(() => {
    const filteredComponents = selectedComponent.filter((component) =>
      component.label.toLowerCase().includes('ueransim')
    );
  
    // Return a list in format "label-name"
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
    let newErrors = {}; // Temporal object to store the new errors

    requi.forEach((component) => {
      const matchedComponent = selectedComponent.find(
        (comp) => comp.label === component.label &&
                  (componentForms[comp.id]?.name === component.name)
      );

      if (matchedComponent) {
        const componentData = componentForms[matchedComponent.id] || {};

        component.requiredFields.forEach((field) => {
          if (
            !componentData.hasOwnProperty(field) || // The error doesnt exist
            componentData[field] === "" ||         // Is empty
            componentData[field] === null||
            (Array.isArray(componentData[field]) && componentData[field].length === 0)
            // Or is null
          ) {
            // Add to new errors
            if (!newErrors[matchedComponent.id]) {
              newErrors[matchedComponent.id] = {};
            }
            newErrors[matchedComponent.id][field] = `The field "${field}" is required for "${component.label}"`;
          }
        });
      }
    });

    SetCerrors(newErrors); // Update the errors
    return Object.keys(newErrors).length === 0;
  };

  
  const getRequiredFields = () => {
    return selectedComponent.map((component) => {
      const componentData = componentForms[component.id] || {};
      return {
        label: component.label,
        name: componentData.name,
        requiredFields: componentData.required || [], // Get the required fields from the component form
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

    setChildError((prevErrors) => {
        const { [id]: removed, ...rest } = prevErrors; // Remove all the errors associated to the component
        return rest;
    });
};


  const handleChildError = useCallback((id, field, message) => {
    setChildError((prevErrors) => {
      const newErrors = {
        ...prevErrors,
        [id]: {
          ...prevErrors[id],
          [field]: message,
        },
      };
  
      // If the message is empty, remove the field from the object
      if (!message) {
        delete newErrors[id][field];
  
        // If the object is empty, remove the component from the object
        if (Object.keys(newErrors[id]).length === 0) {
          delete newErrors[id];
        }
      }
  
      return newErrors;
    });
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
        if (scroll!== null){window.scrollTo({
          top: scroll.offsetTop,
          behavior: "smooth"
        });
      }
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
  
        return {
          label: component.label, // Use label-name format for the download
          data: componentData,
        };
      }),
    };
    (async () => {
      // Get the descriptor in YAML format
      const yamlString = convertJsonToYaml(networkData);
      
      // Create the FormData
      let formData2 = new FormData();
      const blob2 = new Blob([yamlString], { type: "text/yaml" });
      formData2.append("descriptor", blob2, "descriptor.yaml");
  
      // Build the URL
      let url = `${process.env.REACT_APP_ENDPOINT}/tnlcm/trial-network?tn_id=${formData.trialNetworkId}
                  &deployment_site=${formData.deploymentSite}&library_reference_type=${formData.libraryReferenceType}
                  &library_reference_value=${formData.libraryReferenceValue}&sites_reference_type=${formData.sitesReferenceType}
                  &sites_reference_value=${formData.sitesReferenceValue}`;
  
      const createTrialNetwork = async (formData) => {
        
              const access_token = await getAccessTokenFromSessionStorage();
              const auth = `Bearer ${access_token}`;
  
              const response = await axios.post(url, formData, {
                  headers: {
                      Authorization: auth,
                      "Content-Type": "multipart/form-data",
                  },
              });
              return response;
          
      };
      //TODO THE PETITION DOESNT WORK
      try {
          await createTrialNetwork(formData2);
          setSuccess("Trial network deployed successfully");
          setError("");
          setTimeout(() => {
            window.location = "/dashboard";
            setSuccess("");
          }, 1502);
      } catch (error) {
          setSuccess("");
          setError("Failed to deploy trial network \n" + error.response.data.message);
          setTimeout(() => {
            window.location = "/dashboard";
            setError("");
          }, 3002);
      }
  })();
  };
  

  const switchComponent = (component, removeComponent, handleComponentFormChange, handleChildError) => {
    switch (component.label) {
      case "berlin_ran":
        const lbrOKE=filterOneKEComponents();
        const lbrO5=filterO5All();
        return <BerlinRan id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} list={lbrOKE} list2={lbrO5} whenError={handleChildError}/>;
      case "elcm":
        return <Elcm id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} />;
      case "iswireless_radio":
        const lIswrO5=filterO5gsVMorK8SComponents();
        return <IswirelessRadio id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} list={lIswrO5} whenError={handleChildError}/>
      case "ixc_endpoint":
        const lIxeTNV=filterVnetOrTnVxlanComponents();
        return <IxcEndpoint id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} list={lIxeTNV} whenError={handleChildError} />;
      case "ks8500_runner":
        const listKS8 =filterVnetOrTnVxlanComponents();
        return <Ks8500Runner id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} list={listKS8} whenError={handleChildError}/>;
      case "loadcore_agent":
        const listLCA= filterVnetOrTnVxlanComponents();
        return <LoadcoreAgent id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} list={listLCA} whenError={handleChildError}/>;
      case "nokia_radio":
        const listNokia=filterO5gsVMorK8SComponents();
        return <NokiaRadio id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} list={listNokia} whenError={handleChildError}/>;
      case "ocf":
        const listOCF=filterOneKEComponents();
        return <Ocf id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} list={listOCF} whenError={handleChildError}/>;
      case "oneKE":
        const listO1=filterVnetOrTnVxlanComponents();
        const listO2=filterVnetComponents();
        return <OneKe id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} list1={listO1} list2={listO2} whenError={handleChildError}/>;
      case "open5gcore_vm":
        const listO5C1=filterVnetOrTnVxlanComponents();
        const listO5C2=filterVnetComponents();
        return <Open5gcoreVM id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} list1={listO5C1} list2={listO5C2} whenError={handleChildError}/>;
      case "open5gs_k8s":
        const listO5K1=filterOneKEComponents();
        return <Open5gsK8S id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} list={listO5K1} whenError={handleChildError}/>
      case "open5gs_vm":
        const listO5SVM=filterVnetOrTnVxlanComponents();
        return <Open5gcoreVM id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} list1={listO5SVM} list2={listO5SVM} whenError={handleChildError}/>;
      case "opensand_gw":
        const listOGW=filterVnetOrTnVxlanComponents();
        return <OpensandGw id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} list={listOGW} whenError={handleChildError} />;
      case "opensand_sat":
        const listOSAT=filterVnetOrTnVxlanComponents();
        return <OpensandSat id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} list={listOSAT} whenError={handleChildError} />;
      case "opensand_st":
        const listOST=filterVnetOrTnVxlanComponents();
        return <OpensandSt id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} list={listOST} whenError={handleChildError}/>;
      case "stf_ue":
        return <StfUe id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} whenError={handleChildError}/>;
      case "tn_bastion":
        return <TnBastion id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} whenError={handleChildError}/>;
      case "tn_init":
        return <TnInit id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} whenError={handleChildError}/>;
      case "tn_vxlan":
        return <TnVxlan id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} whenError={handleChildError}/>;
      case "tsn":
        return <Tsn id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} whenError={handleChildError}/>;
      case "ueransim":
        const listUE1=filterVnetOrTnVxlanComponents();
        const listUE2=filterOpen5GsComponents();
        const listUE3=filterUeransimComponents();
        return <Ueransim id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} list1={listUE1} list2={listUE2} list3={listUE3} whenError={handleChildError}/>;
      case "upf_p4_sw":
        const listUPF=filterVnetOrTnVxlanComponents();
        return <UpfP4Sw id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} list={listUPF} whenError={handleChildError}/>;
      case "vm_kvm":
        const listVK=filterVnetOrTnVxlanComponents();
        return <VmKvm id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} list={listVK}/>;
      case "vnet":
        return <Vnet id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} whenError={handleChildError}/>;
      case "xrext":
        const listXR=filterVnetOrTnVxlanComponents();
        return <Xrext id={component.id} removeComponent={removeComponent} onChange={handleComponentFormChange} list={listXR}/>;
      default:
        return <NvoModal component={component} removeComponent={removeComponent}/>;
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
            <select
              id="deployment-site"
              name="deploymentSite"
              className={`w-full border p-2 mt-1 rounded-md ${errors.deploymentSite ? "border-red-500" : "border-gray-300"}`}
              value={formData.deploymentSite}
              onChange={handleInputChange}
            >
              <option value="" disabled>--Select a site--</option>
              <option value="UMA">UMA</option>
              <option value="ATHENS">ATHENS</option>
              <option value="BERLIN">BERLIN</option>
              <option value="OULU">OULU</option>
              <option value="FOKUS">FOKUS</option>
            </select>
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
              placeholder="library_reference_value"
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
              placeholder="sites_reference_value"
              className={`w-full border p-2 mt-1 rounded-md ${errors.sitesReferenceValue ? "border-red-500" : "border-gray-300"}`}
              value={formData.sitesReferenceValue}
              onChange={handleInputChange}
            />
            {errors.sitesReferenceValue && <p className="text-red-500 text-sm mt-1">{errors.sitesReferenceValue}</p>}
          </div>
        </div>

        <div className="lg:w-1/2 grid grid-cols-4 gap-4 mt-8 lg:mt-0">
          {allComp.map((label, index) => (
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

        {Object.keys(childError).length > 0 && (
          <div  id="ChError" className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
            <h3 className="font-bold text-lg">Childs errors:</h3>
            <ul className="list-disc pl-5">
              {Object.entries(childError).map(([componentId, fields]) => (
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
      {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
      {success && <div className="mb-4 text-green-500 text-sm">{success}</div>}
    </div>
    
    <div className="p-4 flex justify-center items-center">
      <button
        type="button"
        className="bg-purple-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-purple-500"
        onClick={handleDownload}
      >
        Create new Trial Network
      </button>
    </div>

  </div>
  );
};

export default CreateTN;

