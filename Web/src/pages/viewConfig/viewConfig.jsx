import React, { useState, useEffect } from "react";
import axios from "axios";
import ThreeDots from "../../Components/Spinner/ThreeDots";

const ViewConfig = () => {
  const [drone, setDrone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const droneId = import.meta.env.VITE_DRONE_ID;
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/configs/${droneId}`
        );
        setDrone(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch drone data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto mt-[80px] p-6 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Drone Configuration
      </h1>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center">
          <div className="text-gray-600 text-lg animate-pulse"><ThreeDots /></div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="flex justify-center items-center">
          <div className="text-red-500 text-lg">{error}</div>
        </div>
      )}

      {/* Data Display */}
      {!loading && !error && drone && (
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
          <div className="space-y-4">
            <p className="text-gray-700">
              <strong className="font-semibold text-gray-900">Drone ID:</strong>{" "}
              {drone.drone_id}
            </p>
            <p className="text-gray-700">
              <strong className="font-semibold text-gray-900">Drone Name:</strong>{" "}
              {drone.drone_name}
            </p>
            <p className="text-gray-700">
              <strong className="font-semibold text-gray-900">Light:</strong>{" "}
              {drone.light}
            </p>
            <p className="text-gray-700">
              <strong className="font-semibold text-gray-900">Country:</strong>{" "}
              {drone.country}
            </p>
          </div>
        </div>
      )}

      {/* No Data Fallback */}
      {!loading && !error && !drone && (
        <div className="flex justify-center items-center">
          <div className="text-gray-600 text-lg">No drone data available</div>
        </div>
      )}
    </div>
  );
};

export default ViewConfig;