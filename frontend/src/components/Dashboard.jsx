import { faDesktop, faNetworkWired, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { getAccessTokenFromSessionStorage } from '../auxFunc/jwt';
import TopNavigator from './TopNavigator';

const Dashboard = () => {
  const [data, setData] = useState({ trial_networks: [] }); // Para almacenar los datos de la API
  const [loading, setLoading] = useState(true); // Para manejar el estado de carga
  const [error, setError] = useState(null); // Para manejar errores
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [itemsPerPage] = useState(8); // Número de elementos por página
  const [alturaRestante, setAlturaRestante] = useState(0); // Para almacenar la altura restante calculada
  const [activeCount, setActiveCount] = useState(0);
  const fileInputRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOptionL, setSelectedOptionL] = useState("");
  const [selectedOptionS, setSelectedOptionS] = useState("")
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [changingStatesIdS,setChangingStatesIdS] = useState([]);

  const handlePurgeClick = async () => {
    try {
      // Separar IDs válidos e inválidos
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
  
      // Mostrar alerta si hay IDs no válidos
      if (invalidIds.length > 0) {
        alert(`No se pueden purgar los siguientes IDs porque su estado no es "destroyed" o "validated": ${invalidIds.join(", ")}`);
      }
  
      // Actualizar los estados antes de realizar las peticiones
      setSelectedIds((prevState) => prevState.filter((id) => !selectedIds.includes(id)));
      setChangingStatesIdS((prevState) => [...prevState, ...validIds]);
  
      // Generar las promesas para los IDs válidos
      const deleteRequests = validIds.map(async (id) => {
        const url = `${process.env.REACT_APP_ENDPOINT}/tnlcm/trial-network/purge/${id}`;
        const access_token = await getAccessTokenFromSessionStorage();
        const auth = `Bearer ${access_token}`;
  
        // Realizar la petición PURGE
        return axios.delete(url, {
          headers: {
            Authorization: auth,
            "Content-Type": "application/json",
          },
        });
      });
  
      // Ejecutar todas las promesas con Promise.allSettled
       await Promise.allSettled(deleteRequests);
  
      // Actualizar el estado después de que se completen todas las peticiones
      setChangingStatesIdS((prevState) => prevState.filter((id) => !validIds.includes(id)));
  
    } catch (error) {
      alert("Error al realizar el proceso de purge:", error);
    }
  };
  
  
  

  const handleDestroyClick = async () => {
    try {
      // Actualiza los estados fuera del bucle, antes de realizar las peticiones
      setSelectedIds((prevState) => prevState.filter((id) => !selectedIds.includes(id)));
      setChangingStatesIdS((prevState) => [...prevState, ...selectedIds]);
  
      // Generar las promesas para cada id en el array
      const deleteRequests = selectedIds.map(async (id) => {
        const url = `${process.env.REACT_APP_ENDPOINT}/tnlcm/trial-network/${id}`;
        const access_token = await getAccessTokenFromSessionStorage();
        const auth = `Bearer ${access_token}`;
  
        // Realizar la petición DELETE
        await axios.delete(url, {
          headers: {
            Authorization: auth,
            "Content-Type": "application/json",
          },
        });
  
        // Una vez que la petición se ha realizado, puedes manejar el cambio de estado.
        // Esto es opcional, dependiendo de cómo quieras hacerlo.
      });
  
      // Esperar que todas las promesas se resuelvan
      await Promise.all(deleteRequests);
  
      // Después de que todas las solicitudes se hayan completado, elimina los elementos de changingStatesIdS
      setChangingStatesIdS((prevState) => prevState.filter((id) => !selectedIds.includes(id)));
    } catch (error) {
      alert("Error deleting networks: " + error);
    }
  };
  

  const handleDeployClick = async () => {
    try {
      // Actualizar los estados antes de realizar las peticiones
      setSelectedIds((prevState) => prevState.filter((id) => !selectedIds.includes(id)));
      setChangingStatesIdS((prevState) => [...prevState, ...selectedIds]);
  
      // Crear una lista de promesas para cada solicitud PUT
      const promises = selectedIds.map(async (id) => {
        const url = `${process.env.REACT_APP_ENDPOINT}/tnlcm/trial-network/${id}`;
        const access_token = await getAccessTokenFromSessionStorage();
        const auth = `Bearer ${access_token}`;
  
        // Realizar la petición PUT
        try {
          await axios.put(url, {}, {
            headers: {
              Authorization: auth,
              "Content-Type": "application/json",
            },
          });
  
          // Después de que la petición se haya completado, actualizamos el estado
          setChangingStatesIdS((prevState) => prevState.filter((item) => item !== id));
          return { id, status: 'success' };  // Respuesta exitosa
        } catch (error) {
          return { id, status: 'failed', error };  // Error de la solicitud
        }
      });
  
      await Promise.allSettled(promises);
  
      // Procesar los resultados de las promesas
     
  
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
    // Simula el clic en el input de archivo
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Obtén el archivo seleccionado
    if (file) {
      //  el modal después de seleccionar un archivo
      setIsModalOpen(true);
    
    }

  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    
  };

  const handleSubmitModal = async (event) => {
    setIsLoading(true); // Mostrar el GIF de cargando
    // Obtener los valores de los campos del modal
    const trialNetworkId = document.getElementById("trial-network-id").value;
    const deploymentSite = document.getElementById("deployment-site").value;
    const libraryReferenceType = selectedOptionL;
    const libraryReferenceValue = document.getElementById("library-reference-value").value;
    const sitesReferenceType = selectedOptionS;
    const sitesReferenceValue = document.getElementById("sites-reference-value").value;
    const descriptor = fileInputRef.current.files[0];
    let formData = new FormData();
    const blob = new Blob([descriptor], { type: "text/yaml" });
    formData.append("descriptor", blob, "descriptor.yaml");
  
    let url = `${process.env.REACT_APP_ENDPOINT}/tnlcm/trial-network?tn_id=${trialNetworkId}&deployment_site=${deploymentSite}&library_reference_type=${libraryReferenceType}&library_reference_value=${libraryReferenceValue}&sites_reference_type=${sitesReferenceType}&sites_reference_value=${sitesReferenceValue}`;
  
    // Enviar la petición
    const createTrialNetwork = async (formData) => {
      try {
        const access_token = await getAccessTokenFromSessionStorage();
        const auth = `Bearer ${access_token}`;
  
        const response = await axios.post(url, formData, {
          headers: {
            Authorization: auth,
            "Content-Type": "multipart/form-data",
          },
        });
        return response;
      } catch (err) {
        console.error("Error while creating trial network:", err.response.data.message);
        alert("Failed to fetch data \n" + err.response.data.message);
      }
    };
  
    try {
      await createTrialNetwork(formData);
    } catch (error) {
    alert("Failed to create trial network \n" + error.response.data.message);
    }
    event.target.value = "";
    setIsModalOpen(false);
    setIsLoading(false);
  };
  

  const handleChangeL = (e) => setSelectedOptionL(e.target.value);
  const handleChangeS = (e) => setSelectedOptionS(e.target.value);


  useEffect(() => {
    let timeoutId; // Variable para almacenar el ID del timeout
  
    const fetchData = async () => {
      try {
        const access_token = await getAccessTokenFromSessionStorage();
        if (access_token) {
          const url = process.env.REACT_APP_ENDPOINT;
          const bearerJwt = `Bearer ${access_token}`;
  
          const response = await axios.get(`${url}/tnlcm/trial-networks`, {
            headers: {
              Authorization: bearerJwt,
              "Content-Type": "application/json",
            },
          });
  
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
      const randomInterval = Math.floor(Math.random() * (6 - 3 + 1) + 3) * 1000; // Genera un intervalo entre 3 y 6 segundos
      timeoutId = setTimeout(() => {
        fetchData();
        scheduleNextFetch(); // Programa la próxima ejecución
      }, randomInterval);
    };
  
    // Ejecutar la primera vez y programar las siguientes
    fetchData();
    scheduleNextFetch();
  
    // Cleanup para evitar múltiples ejecuciones
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);
  
  
  

  useLayoutEffect(() => {
    const updateAlturaRestante = () => {
      const topNavElement = document.getElementById("topNavigator");
      if (topNavElement) {
        const height = topNavElement.getBoundingClientRect().height; // Obtener la altura usando getBoundingClientRect
        setAlturaRestante(window.innerHeight - height - 200); // Calcular la altura restante
      }
    };

    // Ejecutar inmediatamente la función y luego cada 1 segundo
    updateAlturaRestante();
    const intervalId = setInterval(updateAlturaRestante, 100);

    // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(intervalId);
  }, []); // Solo se configura una vez al montar el componente
  

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

  // Calcular los índices para la paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.trial_networks.slice(indexOfFirstItem, indexOfLastItem);

  // Número total de páginas
  const totalPages = Math.ceil(data.trial_networks.length / itemsPerPage);

  // Cambiar de página
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Formatear la fecha
  const formatDate = (isoDate) => {
    const date = new Date(isoDate); // Convertir el string ISO en un objeto Date
  
    // Extraer los componentes de la fecha y hora
    const day = String(date.getDate()).padStart(2, '0'); // Día con ceros a la izquierda
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mes con ceros a la izquierda
    const year = date.getFullYear(); // Año
    const hours = String(date.getHours()).padStart(2, '0'); // Horas con ceros a la izquierda
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Minutos con ceros a la izquierda
    const seconds = String(date.getSeconds()).padStart(2, '0'); // Segundos con ceros a la izquierda
  
    // Formatear la fecha y hora
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
            <div className="flex items-center space-x-4">
              {/* Search Input */}
              <div className="relative">
                <input type="text" placeholder="Search" className="border rounded-lg py-2 px-4 text-sm w-64" />
                <FontAwesomeIcon icon={faSearch} className="absolute top-3 right-4 text-gray-400" />
              </div>
            </div>
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
                Import new File
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }} // Oculta el input
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

                  {/* Sites Reference Type */}
                  <div>
                    <label htmlFor="sites-reference-type" className="block text-gray-700 font-medium">
                      SITES REFERENCE TYPE
                    </label>
                    <select
                      id="sites-reference-type"
                      className="w-full border border-gray-300 rounded-md p-2 mt-1"
                      value={selectedOptionS}
                      onChange={handleChangeS}
                    >
                      <option value="" disabled>
                        -- Select an option --
                      </option>
                      <option value="branch">branch</option>
                      <option value="commit">commit</option>
                      <option value="tag">tag</option>
                    </select>
                  </div>

                  {/* Sites Reference Value */}
                  <div>
                    <label htmlFor="sites-reference-value" className="block text-gray-700 font-medium">
                      SITES REFERENCE VALUE
                    </label>
                    <input
                      id="sites-reference-value"
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
                            src="loading.gif" // Cambia por la URL de tu GIF de carga
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
            {/* Botón para desplegar redes */}
            <button
              className="bg-blue-800 text-white py-2 px-4 rounded-lg shadow-sm hover:bg-blue-500"
              onClick={handleDeployClick}
            >
              Deploy Networks
            </button>

            {/* Botón para detener redes */}
            <button
              className="bg-yellow-700 text-white py-2 px-4 rounded-lg shadow-sm hover:bg-yellow-500"
              onClick={handleDestroyClick}
            >
              Destroy Networks
            </button>

            {/* Botón para purgar redes */}
            <button
              className="bg-red-800 text-white py-2 px-4 rounded-lg shadow-sm hover:bg-red-500"
              onClick={handlePurgeClick}
            >
              Purge Networks
            </button>
          </div>
          <table className="w-full text-left border-collapse ">
            <thead>
              <tr className="text-gray-500 text-sm border-b">
                <th className="py-2">Select</th>
                <th className="py-2">Trial Network ID</th>
                <th className="py-2">Date Created UTC </th>
                <th className="py-2">Deployment Site</th>
                <th className="py-2">Status</th>
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
                        ? "" // No aplicamos fondo cuando se está cargando
                        : network.state === "failed" || network.state === "destroyed"
                        ? "bg-red-100 text-red-500"
                        : network.state === "validated"
                        ? "bg-blue-100 text-blue-500"
                        : "bg-green-100 text-green-500",
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
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginación */}
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
