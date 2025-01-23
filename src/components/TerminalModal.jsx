import { faArrowsRotate, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { getAccessTokenFromSessionStorage } from "../auxFunc/jwt";
const TerminalModal = ({ isOpen, onClose, vmId }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para obtener los logs, envolviendo en useCallback
  const fetchLogs = useCallback(async () => {
    if (!vmId) return;

    setLoading(true);
    setError(null);

    try {
      const access_token = await getAccessTokenFromSessionStorage();
      const response = await axios.get(
        `${process.env.REACT_APP_ENDPOINT}/tnlcm/trial-networks/${vmId}.log`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      // Si el log es un string, lo dividimos por líneas
      if (typeof response.data.log === "string") {
        const logLines = response.data.log.split("\n"); // Divide el string por saltos de línea
        setLogs(logLines);
      } else {
        setLogs([]); // Si no es un string, manejamos el caso como vacío
      }
    } catch (err) {
      setError("Error al obtener los logs de la máquina virtual: " + err);
    } finally {
      setLoading(false);
    }
  }, [vmId]); // Solo se vuelve a crear si cambia vmId

  useEffect(() => {
    if (isOpen) {
      // Llamar inicialmente para obtener los logs cuando se abre el modal
      fetchLogs();
    }
  }, [isOpen, vmId, fetchLogs]); // Agregamos fetchLogs como dependencia

  if (!isOpen) return null; // Si el modal no está abierto, no se renderiza

  // Función para aplicar estilos dependiendo del tipo de log
  const getLogStyle = (log) => {
    if (log.includes("[ERROR]")) {
      return "text-red-500"; // Color rojo para errores
    } else if (log.includes("[INFO]")) {
      return "text-blue-500"; // Color azul para info
    }
    return "text-green-400"; // Color verde para otros logs
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white rounded-lg shadow-lg w-11/12 max-w-4xl">
        {/* Encabezado */}
        <div className="flex justify-between items-center border-b border-gray-700 px-4 py-2">
          <h2 className="text-lg font-semibold">Terminal Logs - VM: {vmId}</h2>
          <div className="flex space-x-2">
            <button
              className="text-yellow-400 hover:text-yellow-500"
              onClick={fetchLogs} // Llamar a la función fetchLogs cuando se presione el botón
            >
            <FontAwesomeIcon icon={faArrowsRotate}/>
            </button>
            <button
              className="text-red-400 hover:text-red-500"
              onClick={onClose}
            >
              <FontAwesomeIcon icon={faX} />
            </button>
          </div>
        </div>

        {/* Contenido de la terminal */}
        <div
          className="p-4 overflow-y-auto h-96 font-mono bg-black rounded-b-lg"
          style={{ whiteSpace: "pre-wrap" }}
        >
          {loading ? (
            <img src="loading.gif" alt="loading" />
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : logs.length > 0 ? (
            logs.map((log, index) => (
              <p key={index} className={getLogStyle(log)}>
                {log}
              </p>
            ))
          ) : (
            <p className="text-gray-500">No logs avaliables.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TerminalModal;
