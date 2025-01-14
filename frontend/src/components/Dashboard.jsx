import { faDesktop, faNetworkWired, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { getAccessTokenFromSessionStorage } from '../auxFunc/jwt';
import TopNavigator from './TopNavigator';

const Dashboard = () => {
  const [data, setData] = useState({ trial_networks: [] }); // Para almacenar los datos de la API
  const [loading, setLoading] = useState(true); // Para manejar el estado de carga
  const [error, setError] = useState(null); // Para manejar errores
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [itemsPerPage] = useState(8); // Número de elementos por página
  const [alturaRestante, setAlturaRestante] = useState(0); // Para almacenar la altura restante calculada
  const [topNavHeight, setTopNavHeight] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  


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
        setError("Error al obtener los datos.");
      } finally {
        setLoading(false);
      }
    };
  
    const scheduleNextFetch = () => {
      const randomInterval = Math.floor(Math.random() * (6 - 3 + 1) + 3) * 1000; // Genera un intervalo entre 3 y 6 segundos
      console.log(`Próxima ejecución en: ${randomInterval / 1000} segundos`);
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
    const timeoutId = setTimeout(() => {
      const topNavElement = document.getElementById('topNavigator');
      if (topNavElement) {
        const height = topNavElement.getBoundingClientRect().height; // Obtener la altura usando getBoundingClientRect
        setTopNavHeight(height); // Actualizar el estado con la altura
        setAlturaRestante(window.innerHeight - height - 200); // Calcular la altura restante
      }
    }, 100); // 100 ms de retraso
  
    return () => {
      clearTimeout(timeoutId); // Limpiar el timeout si el componente se desmonta
    };
  }, []);
  

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <img src="/images/loading.gif" alt="Loading..." />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
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
            <button className="bg-purple-600 text-white py-2 px-4 rounded-lg shadow-md">Create new Network</button>
            <button className="bg-purple-600 text-white py-2 px-4 rounded-lg shadow-md">Import new File</button>
          </div>
          <table className="w-full text-left border-collapse ">
            <thead>
              <tr className="text-gray-500 text-sm border-b">
                <th className="py-2">Trial Network ID</th>
                <th className="py-2">Date Created UTC </th>
                <th className="py-2">Deployment Site</th>
                <th className="py-2">Library URL</th>
                <th className="py-2">Sites URL</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {currentItems.map((network, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">
                    <a href="" className="text-purple-600 hover:underline">{network.tn_id}</a>
                  </td>
                  <td className="py-2">{formatDate(network.date_created_utc)}</td>
                  <td className="py-2">{network.deployment_site}</td>
                  <td className="py-2">
                    {network.github_6g_library_https_url ? (
                      <a href={network.github_6g_library_https_url} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                        {network.github_6g_library_https_url}
                      </a>
                    ) : "N/A"}
                  </td>
                  <td className="py-2">
                    {network.github_6g_sandbox_sites_https_url ? (
                      <a href={network.github_6g_sandbox_sites_https_url} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                        {network.github_6g_sandbox_sites_https_url}
                      </a>
                    ) : "N/A"}
                  </td>
                  <td className="py-2">
                    <span className={`
                      bg-${network.state === 'failed' ? 'red' : 'green'}-100 
                      text-${network.state === 'failed' ? 'red' : 'green'}-500 
                      py-1 px-3 rounded-full text-xs`}>
                      {network.state}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginación */}
          <div className={`flex  justify-between items-center mt-4 text-sm text-gray-500`}>
            <p>Showing data {indexOfFirstItem + 1} to {indexOfLastItem<data.trial_networks.length ? indexOfLastItem : data.trial_networks.length} of {data.trial_networks.length} entries</p>
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
