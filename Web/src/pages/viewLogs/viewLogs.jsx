// Web/src/pages/ViewLogs.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import ThreeDots from "../../Components/Spinner/ThreeDots";
import { useParams } from "react-router-dom";

const ViewLogs = () => {
  const { yourDroneId } = useParams(); // Get droneId from URL params
  const droneId = yourDroneId || import.meta.env.VITE_DRONE_ID; // Fallback to .env if no param
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/logs/${droneId}`);
        setLogs(response.data); // Expecting an array of logs
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch drone logs");
        setLoading(false);
      }
    };

    fetchLogs();
  }, [droneId]); // Re-fetch if droneId changes

  return (
    <div className="container mx-auto mt-[80px] p-6 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        View Logs (ID: {droneId})
      </h1>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center">
          <ThreeDots />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="flex justify-center items-center">
          <div className="text-red-500 text-lg">{error}</div>
        </div>
      )}

      {/* Logs Table */}
      {!loading && !error && logs.length > 0 && (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Drone ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Drone Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Celsius
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.map((log, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.drone_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.drone_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(log.created).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.country}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.celsius}°C
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No Logs Fallback */}
      {!loading && !error && logs.length === 0 && (
        <div className="flex justify-center items-center">
          <div className="text-gray-600 text-lg">No logs available for this drone</div>
        </div>
      )}
    </div>
  );
};

export default ViewLogs;