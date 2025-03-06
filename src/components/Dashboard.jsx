import { faDesktop, faNetworkWired, faTerminal } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { createTrialNetwork, deleteTN, getTrialNetworks, purgeTN, putTN } from '../auxFunc/api';
import { getAccessTokenFromSessionStorage } from '../auxFunc/jwt';
import TerminalModal from './TerminalModal';
import TopNavigator from './TopNavigator';

const Dashboard = () => {
  const [data, setData] = useState({ trial_networks: [] }); // Api data storing
  const [loading, setLoading] = useState(true); // Loading state handler
  const [error, setError] = useState(null); // Error state handler
  const [currentPage, setCurrentPage] = useState(1); // Actual page
  const [itemsPerPage] = useState(8); // Nuember of items per page
  const [alturaRestante, setAlturaRestante] = useState(0); // Height of the table
  const [activeCount, setActiveCount] = useState(0);
  const fileInputRef = useRef(null);
  const fileInputRef2 = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOptionL, setSelectedOptionL] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [changingStatesIdS,setChangingStatesIdS] = useState([]);
  const [isModalOpen2, setModalOpen2] = useState(false);
  const [selectedNetworkId, setSelectedNetworkId] = useState(null);
  const [selectedFile1, setSelectedFile1] = useState(null);
  const navigate = useNavigate();

  const handleOpenLogs = (tn_id) => {
    setSelectedNetworkId(tn_id); // Set the selected network ID
    setModalOpen2(true); // Open the modal
  };

  const handlePurgeClick = async () => {
    try {
      // Filter valid and invalid IDs
      const validIds = [];
      const invalidIds = [];
      
      selectedIds.forEach((id) => {
        const network = data.trial_networks.find((network) => network.tn_id === id);
        if (network && (network.state === "validated" || network.state === "destroyed")) {
          validIds.push(id);
        } else {
          invalidIds.push(id);
        }
      });
  
      // Show an alert if there are invalid IDs
      if (invalidIds.length > 0) {
        alert(`Can not be purged the nexts TNs becouse their state is not "validated" or "destroyed": ${invalidIds.join(", ")}`);
      }
  
      // Update the state before making the requests
      setSelectedIds((prevState) => prevState.filter((id) => !selectedIds.includes(id)));
      setChangingStatesIdS((prevState) => [...prevState, ...validIds]);
  
      // Generate the PURGE requests for each ID
      const purgeRequest = validIds.map(async (id) => {
        return await purgeTN(id);
      });
  
      // Make all with Promise.allSettled
       await Promise.allSettled(purgeRequest);
  
      // Set the state after all requests are completed
      setChangingStatesIdS((prevState) => prevState.filter((id) => !validIds.includes(id)));
  
    } catch (error) {
      alert("Error while purging:", error);
    }
  };
  
  
  

  const handleDestroyClick = async () => {
    try {
      // Filter valid and invalid IDs
      const validIds = [];
      const invalidIds = [];
      
      selectedIds.forEach((id) => {
        const network = data.trial_networks.find((network) => network.tn_id === id);
        if (network && ((network.state === "activated") || (network.state === "failed"))) {
          validIds.push(id);
        } else {
          invalidIds.push(id);
        }
      });

      // Show an alert if there are invalid IDs
      if (invalidIds.length > 0) {
        alert(`Can not destroy the nexts TNs becouse their state is not "activated" or "failed": ${invalidIds.join(", ")}`);
      }

      // Set the states before making the requests
      setSelectedIds((prevState) => prevState.filter((id) => !selectedIds.includes(id)));
      setChangingStatesIdS((prevState) => [...prevState, ...validIds]);
  
      // Make a DELETE request for each ID
      const deleteRequests = validIds.map(async (id) => {
        await deleteTN(id);
      });
  
      // Wait for all requests to complete
      await Promise.all(deleteRequests);
  
      // After all requests are completed, update the state
      setChangingStatesIdS((prevState) => prevState.filter((id) => !validIds.includes(id)));
    } catch (error) {
      alert("Error deleting networks: " + error);
    }
  };
  

  const handleDeployClick = async () => {
    try {
      // Set the states before making the requests
      setSelectedIds((prevState) => prevState.filter((id) => !selectedIds.includes(id)));
      setChangingStatesIdS((prevState) => [...prevState, ...selectedIds]);
  
      // Create a PUT request for each ID
      const promises = selectedIds.map(async (id) => {
        // Make the PUT request
        try {
          await putTN(id);
          // After the request is completed, update the state
          setChangingStatesIdS((prevState) => prevState.filter((item) => item !== id));
          return { id, status: 'success' };
        } catch (error) {
          return { id, status: 'failed', error };
        }
      });
  
      await Promise.allSettled(promises);

    } catch (error) {
      alert("Error deploying networks: " + error);
    }
  };
  
  

  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((existingId) => existingId !== id)
        : [...prev, id]
    );
  };

  const handleButtonClick = () => {
    // Do like a click on the input
    fileInputRef.current.click();
  };
  const handleButtonClick2 = () => {
    // Do like a click on the input
    fileInputRef2.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the first file
    if (file) {
      setSelectedFile1(file);
      setIsModalOpen(true);
    }
  };

  const handleFileChange2 = (event) => {
    const file = event.target.files[0]; // Get the first file
    if (file) {
      //Check the file is a YAML
      const validExtensions = ["application/x-yaml", "text/yaml", "text/x-yaml", "application/yaml"];
      const fileExtension = file.name.split(".").pop().toLowerCase();
  
      if (!validExtensions.includes(file.type) && fileExtension !== "yaml") {
        alert("Error: Only allowed YAML files (.yaml)");
        return;
      }
  
      navigate("/dashboard/createTN", {
        state: { file }, // Send the file to the next page
      });
    }
  };
  

  const handleCloseModal = () => {
    setIsModalOpen(false);
    
  };

  const handleSubmitModal = async (event) => {
    setIsLoading(true); // Show the loading spinner
    // Get the values from the form
    const trialNetworkId = document.getElementById("trial-network-id").value;
    const deploymentSite = document.getElementById("deployment-site").value;
    const libraryReferenceType = selectedOptionL;
    const libraryReferenceValue = document.getElementById("library-reference-value").value;
    const descriptor = selectedFile1;
    let formData = new FormData();
    const blob = new Blob([descriptor], { type: "text/yaml" });
    formData.append("descriptor", blob, "descriptor.yaml");
  
    let url = `${process.env.REACT_APP_TNLCM_BACKEND_API}/tnlcm/trial-network/create-validate?tn_id=${trialNetworkId}&deployment_site=${deploymentSite}&library_reference_type=${libraryReferenceType}&library_reference_value=${libraryReferenceValue}`;
  
    // Send the POST request
    const cTN = async (formData) => {
      try {
        return await createTrialNetwork(formData,url);
      } catch (err) {
        console.error("Error while creating trial network:", err.response.data.message);
        alert("Failed to fetch data \n" + err.response.data.message);
      }
    };
  
    try {
      await cTN(formData);
    } catch (error) {
    alert("Failed to create trial network \n" + error.response.data.message);
    }
    event.target.value = "";
    setIsModalOpen(false);
    setIsLoading(false);
  };
  

  const handleChangeL = (e) => setSelectedOptionL(e.target.value);


  useEffect(() => {
    let timeoutId; // Store the ID of the timeout
  
    const fetchData = async () => {
      try {
        const access_token = await getAccessTokenFromSessionStorage();
        if (access_token) {
          
  
          const response = await getTrialNetworks();
  
          setData(response.data);
  
          const trialNetworks = response.data.trial_networks;
          const activeNetworks = trialNetworks.filter(
            (network) => network.state === "activated"
          );
          setActiveCount(activeNetworks.length);
        } else {
          setError("No token found");
          setTimeout(() => {
            window.location = "/";
          }, 1000);
        }
      } catch (err) {
        setError("Unexpected error in backend. Try again later.");
      } finally {
        setLoading(false);
      }
    };
  
    const scheduleNextFetch = () => {
      const randomInterval = Math.floor(Math.random() * (6 - 3 + 1) + 3) * 1000; // Make a random interval between 3 and 6 seconds
      timeoutId = setTimeout(() => {
        fetchData();
        scheduleNextFetch(); // Set the next fetch
      }, randomInterval);
    };
    fetchData();
    scheduleNextFetch();
  
    // Cleanup for the next timeout
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);
  
  
  

  useLayoutEffect(() => {
    const updateAlturaRestante = () => {
      const topNavElement = document.getElementById("topNavigator");
      if (topNavElement) {
        const height = topNavElement.getBoundingClientRect().height; // Get the height using getBoundingClientRect
        setAlturaRestante(window.innerHeight - height - 200); // Compute the remaining height
      }
    };

    // Execute the function and set the interval
    updateAlturaRestante();
    const intervalId = setInterval(updateAlturaRestante, 100);

    // Clean the interval
    return () => clearInterval(intervalId);
  }, []); // Only execute once
  

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <img src="loading.gif" alt="Loading..." />
      </div>
    );
  }

  if (error) {
    return <div className="fixed inset-0 flex justify-center items-center bg-white-600 bg-opacity-50">
    <div className="text-red-500 text-4xl font-bold text-center">{error}</div>
    </div>
  }

  // Compute the indexes of the items to show
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.trial_networks.slice(indexOfFirstItem, indexOfLastItem);

  // Total pages
  const totalPages = Math.ceil(data.trial_networks.length / itemsPerPage);

  // Switch the page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Format the date
  const formatDate = (isoDate) => {
    const date = new Date(isoDate); // ISO to Date
  
    // Extract the date and time
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear(); // Año
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    // Make the new format
    return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="bg-gray-100 font-sans min-h-screen flex flex-col ">
      {/* Navbar */}
      <TopNavigator />
      {/* Main Content */}
      <div className="p-6 flex-grow flex-col ">
        {/* Stats Section */}
        <div id="stats" className="grid grid-cols-2 gap-6 mb-6 min-w-full flex">
          <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
            <div className="bg-green-100 text-green-500 rounded-full p-4 mr-4">
              <FontAwesomeIcon icon={faNetworkWired} className="text-2xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Networks</p>
              <p className="text-2xl font-bold">{data.trial_networks.length}</p>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
            <div className="bg-green-100 text-green-500 rounded-full p-4 mr-4">
              <FontAwesomeIcon icon={faDesktop} className="text-2xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Active Now</p>
              <p className="text-2xl font-bold">{activeCount}</p>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div id="tabla" style={{ height: `${alturaRestante}px` }} className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">All Networks</h2>
          </div>
          <div className="flex space-x-4 mb-4">
              <button
                className="bg-purple-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-purple-500"
                onClick={() => (window.location = "/dashboard/createTN")}
              >
                Create new Network
              </button>
              <button
                className="bg-purple-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-purple-500"
                onClick={handleButtonClick}
              >
                Create Network via File
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }} // Hide the input
              />
              <button
                className="bg-purple-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-purple-500"
                onClick={handleButtonClick2}
              >
                Edit Network via File
              </button>
              <input
                type="file"
                ref={fileInputRef2}
                onChange={handleFileChange2}
                style={{ display: "none" }} // Hide the input
              />

              {/* Modal */}
              {isModalOpen && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                  <h2 className="text-xl font-semibold mb-4">File Details</h2>

                  {/* Trial Network ID */}
                  <div>
                    <label htmlFor="trial-network-id" className="block text-gray-700 font-medium">
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
                    <label htmlFor="deployment-site" className="block text-gray-700 font-medium">
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
                    <label htmlFor="library-reference-type" className="block text-gray-700 font-medium">
                      LIBRARY REFERENCE TYPE
                    </label>
                    <select
                      id="library-reference-type"
                      className="w-full border border-gray-300 rounded-md p-2 mt-1"
                      value={selectedOptionL}
                      onChange={handleChangeL}
                    >
                      <option value="" disabled>
                        -- Select an option --
                      </option>
                      <option value="branch">branch</option>
                      <option value="commit">commit</option>
                      <option value="tag">tag</option>
                    </select>
                  </div>

                  {/* Library Reference Value */}
                  <div>
                    <label htmlFor="library-reference-value" className="block text-gray-700 font-medium">
                      LIBRARY REFERENCE VALUE
                    </label>
                    <input
                      id="library-reference-value"
                      type="text"
                      placeholder="github_6g_library_reference_value"
                      className="w-full border border-gray-300 rounded-md p-2 mt-1"
                    />
                  </div>
                  {/* Buttons div */}
                  <div className='flex justify-between mt-4'>
                    {/* Submit Modal Button */}
                    <div className="mt-4 text-left">
                      {isLoading ? (
                        <div className="flex justify-center items-center">
                          <img
                            src="loading.gif"
                            alt="validating..."
                            className="h-8 w-8"
                          />
                        </div>
                      ) : (
                        <button
                          className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-500"
                          onClick={handleSubmitModal}
                        >
                          Submit
                        </button>
                      )}
                    </div>
                    {/* Close Modal Button */}
                    <div className="mt-4 text-right">
                      <button
                        className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-500"
                        onClick={handleCloseModal}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex space-x-4 mb-4">
            {/* Deploy button */}
            <button
              className={`py-2 px-4 rounded-lg shadow-sm text-white font-semibold
                bg-gradient-to-r from-green-700 to-yellow-700
                bg-[position:-30%_0]
                hover:opacity-80 transition-all duration-600`}
              onClick={handleDeployClick}
            >
              Turn On/Off Networks
            </button>

            {/* Destroy button*/}
            <button
              className="bg-red-700 text-white py-2 px-4 rounded-lg shadow-sm hover:bg-red-500"
              onClick={handleDestroyClick}
            >
              Destroy Networks
            </button>

            {/* Purge button */}
            <button
              className="bg-red-800 text-white py-2 px-4 rounded-lg shadow-sm hover:bg-red-500"
              onClick={handlePurgeClick}
            >
              Purge Networks
            </button>
          </div>
          <table className="w-full text-left border-collapse ">
            <thead>
              <tr className=" text-gray-500 text-sm border-b">
                <th className="py-2">Select</th>
                <th className="py-2">Trial Network ID</th>
                <th className="py-2">Date Created UTC </th>
                <th className="py-2">Deployment Site</th>
                <th className="py-2">Status</th>
                <th className="py-2">Logs</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {currentItems.map((network, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">
                    <input
                      type="checkbox"
                      id= {`checkbox-${network.tn_id}`}
                      onChange={() => handleCheckboxChange(network.tn_id)}
                      checked={selectedIds.includes(network.tn_id)}
                      disabled={changingStatesIdS.includes(network.tn_id)}
                    />
                  </td>
                  <td className="py-2">
                  <button className="text-purple-600 hover:underline">{network.tn_id}</button>
                  </td>
                  <td className="py-2">{formatDate(network.date_created_utc)}</td>
                  <td className="py-2">{network.deployment_site}</td>
                  <td className="py-2">
                  <span
                    className={[
                      changingStatesIdS.includes(network.tn_id)
                        ? "" // No background color when changing state
                        : network.state === "failed" || network.state === "destroyed"
                        ? "bg-red-100 text-red-500"
                        : network.state === "validated"
                        ? "bg-blue-100 text-blue-500"
                        : network.state === "suspended"
                        ? "bg-yellow-100 text-yellow-500"
                        : "bg-green-100 text-green-500", // Other stater=== Activated
                      "py-1 px-3 rounded-full text-xs",
                    ].join(" ")}
                  >
                    {changingStatesIdS.includes(network.tn_id) ? (
                      <img src="loading.gif" alt="loading" className="flex w-6 h-6 justify-center items-center" />
                    ) : (
                      network.state
                    )}
                  </span>
                  </td>
                  <td className="py-2">
                    <button className="text-purple-600 hover:underline" onClick={() => handleOpenLogs(network.tn_id)} ><FontAwesomeIcon icon={faTerminal} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Modal for logs */}
          {isModalOpen2 && (
            <TerminalModal
              isOpen={isModalOpen2}
              onClose={() => setModalOpen2(false)}
              vmId={selectedNetworkId}
            />
          )}
          {/* Page */}
          <div className={`flex  justify-between items-center mt-4 text-sm text-gray-500`}>
            <p>Showing data {data.trial_networks.length>0? indexOfFirstItem+1 : 0 } to {indexOfLastItem<data.trial_networks.length ? indexOfLastItem : data.trial_networks.length} of {data.trial_networks.length} entries</p>
            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`py-1 px-3 rounded-lg ${currentPage === index + 1 ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
