import { faArrowsRotate, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useEffect, useState } from "react";
import { getLogs } from "../auxFunc/api";
const TerminalModal = ({ isOpen, onClose, vmId }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get logs from the server
  const fetchLogs = useCallback(async () => {
    if (!vmId) return;

    setLoading(true);
    setError(null);

    try {
       const response = getLogs(vmId);
      // If the response contains a log string, split it by new lines
      if (typeof response.data.log_content === "string") {
        const logLines = response.data.log_content.split("\n");
        setLogs(logLines);
      } else {
        setLogs([]);
      }
    } catch (err) {
      setError("Error while retrieving the logs from the server: " + err);
    } finally {
      setLoading(false);
    }
  }, [vmId]); // Only re-run the effect if vmId changes

  useEffect(() => {
    if (isOpen) {
      // Call fetchLogs when the modal is opened
      fetchLogs();
    }
  }, [isOpen, vmId, fetchLogs]);

  if (!isOpen) return null;

  // Make the log text colorful based on the log type
  const getLogStyle = (log) => {
    if (log.includes("[ERROR]")) {
      return "text-red-500"; // Red color for errors
    } else if (log.includes("[INFO]")) {
      return "text-blue-500"; // Blue color for info logs
    }
    return "text-green-400"; // Green color for other logs
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white rounded-lg shadow-lg w-11/12 max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-700 px-4 py-2">
          <h2 className="text-lg font-semibold">Terminal Logs - VM: {vmId}</h2>
          <div className="flex space-x-2">
            <button
              className="text-yellow-400 hover:text-yellow-500"
              onClick={fetchLogs}
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

        {/* Terminal logs */}
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
