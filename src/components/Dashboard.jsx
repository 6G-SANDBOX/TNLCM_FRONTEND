import { faDesktop, faNetworkWired, faTerminal } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { deleteTN, getTrialNetworks, purgeTN, putTN } from '../auxFunc/api';
import { getAccessTokenFromSessionStorage } from '../auxFunc/jwt';
import TerminalModal from './TerminalModal';
import TopNavigator from './TopNavigator';

const Dashboard = () => {
  const [data, setData] = useState({ trial_networks: [] }); // Api data storing
  const [loading, setLoading] = useState(true); // Loading state handler
  const [error, setError] = useState(null); // Error state handler
  const [currentPage, setCurrentPage] = useState(1); // Actual page
  const [itemsPerPage] = useState(8); // Number of items per page
  const [alturaRestante, setAlturaRestante] = useState(0); // Height of the table
  const [activeCount, setActiveCount] = useState(0);
  const fileInputRef2 = useRef(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [changingStatesIdS,setChangingStatesIdS] = useState([]);
  const [isModalOpen2, setModalOpen2] = useState(false);
  const [selectedNetworkId, setSelectedNetworkId] = useState(null);
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
        if (network && (network.state === "validated" || network.state === "destroyed" || network.state === "created")) {
          validIds.push(id);
        } else {
          invalidIds.push(id);
        }
      });
  
      // Show an alert if there are invalid IDs
      if (invalidIds.length > 0) {
        alert(`Can not be purged the nexts TNs becouse their state is not "validated", "destroyed" or "created": ${invalidIds.join(", ")}`);
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
        if (network && ((network.state === "activated") || (network.state.includes("failed")))) {
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

  const handleButtonClick2 = () => {
    // Do like a click on the input
    fileInputRef2.current.click();
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
                <th className="py-2">Trial Network ID (Click to play)</th>
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
                      disabled={changingStatesIdS.includes(network.tn_id) || network.state.includes("ing")}
                    />
                  </td>
                  <td className="py-2">
                  {["created", "activated"].includes(network.state) ? (
                    <Link to={`/dashboard/${network.tn_id}`}>
                      <button className="text-purple-600 hover:underline">
                        {network.tn_id}
                      </button>
                    </Link>
                  ) : (
                    <button className="text-gray-400 cursor-not-allowed" disabled>
                      {network.tn_id}
                    </button>
                  )}
                  </td>
                  <td className="py-2">{formatDate(network.date_created_utc)}</td>
                  <td className="py-2">{network.state === "created" ?  "Not deployed yet" : network.deployment_site}</td>
                  <td className="py-2">
                  <span
                    className={[
                      network.state.includes("ing") ? ""
                        : network.state.includes("failed") || network.state.includes("destroyed")
                        ? "bg-red-100 text-red-500"
                        : network.state === "validated"
                        ? "bg-blue-100 text-blue-500"
                        : network.state === "suspended"
                        ? "bg-yellow-100 text-yellow-500"
                        : network.state === "created"
                        ? "bg-gray-100 text-gray-500"
                        : "bg-green-100 text-green-500",
                      "py-1 px-3 rounded-full text-xs",
                    ].join(" ")}
                  >
                  { network.state.includes("ing") ? (
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
