// Web/src/pages/TempLogForm.jsx
import React, { useState } from "react";
import axios from "axios";
import ThreeDots from "../../Components/Spinner/ThreeDots";
import { useParams } from "react-router-dom";
import { countries } from "countries-list";

const TempLogForm = () => {
  const { yourDroneId } = useParams();
  const droneId = yourDroneId || import.meta.env.VITE_DRONE_ID || ""; // Fallback to empty string if undefined
  const [formData, setFormData] = useState({
    drone_id: "",
    drone_name: "",
    country: "",
    celsius: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [countrySearch, setCountrySearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Extract and sort country names
  const countryNames = Object.values(countries).map((c) => c.name).sort();

  // Debug initial values
  // console.log("Initial droneId from params or env:", droneId);
  // console.log("Initial formData:", formData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "celsius" ? value : value,
    }));
    if (error) setError(null);
  };

  const handleCountrySearch = (e) => {
    setCountrySearch(e.target.value);
    setIsDropdownOpen(true);
  };

  const handleCountrySelect = (country) => {
    setFormData((prev) => ({ ...prev, country }));
    setCountrySearch(country);
    setIsDropdownOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
  
    const submitData = {
      drone_id: Number(formData.drone_id),
      drone_name: formData.drone_name,
      country: formData.country,
      celsius: Number(formData.celsius),
    };
  
    // Validate required fields
    if (!submitData.drone_id || !submitData.drone_name || !submitData.country || submitData.celsius === undefined) {
      setError("Missing required fields");
      setLoading(false);
      return;
    }
  
    // console.log("Submitting log data:", submitData);
  
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/logs`,
        submitData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`, // เพิ่ม Token
          },
        }
      );
  
      // console.log("Server response:", response.data);
      setSuccess("Log created successfully!");
      setFormData({
        drone_id: "",
        drone_name: "",
        country: "",
        celsius: "",
      });
      setCountrySearch("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create log");
      console.error("Submission error:", {
        message: err.message,
        response: err.response?.data,
      });
    } finally {
      setLoading(false);
    }
  };  

  const filteredCountries = countryNames.filter((country) =>
    country.toLowerCase().includes(countrySearch.toLowerCase())
  );

  return (
    <div className="container mx-auto mt-[80px] p-6 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Add Temperature Log
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-6 border border-gray-200"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Drone ID</label>
            <input
              type="number"
              name="drone_id"
              value={formData.drone_id}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              placeholder="e.g., 3001"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Drone Name</label>
            <input
              type="text"
              name="drone_name"
              value={formData.drone_name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              placeholder="e.g., DroneX"
            />
          </div>
          <div className="relative">
            <label className="block text-gray-700 font-semibold mb-1">Country</label>
            <input
              type="text"
              value={countrySearch}
              onChange={handleCountrySearch}
              onFocus={() => setIsDropdownOpen(true)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Type to search countries..."
              required
            />
            {isDropdownOpen && filteredCountries.length > 0 && (
              <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {filteredCountries.map((country) => (
                  <li
                    key={country}
                    onClick={() => handleCountrySelect(country)}
                    className="px-4 py-2 text-gray-700 hover:bg-indigo-100 cursor-pointer"
                  >
                    {country}
                  </li>
                ))}
              </ul>
            )}
            {isDropdownOpen && filteredCountries.length === 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-2 text-gray-500">
                No countries found
              </div>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Temperature (°C)</label>
            <input
              type="number"
              name="celsius"
              value={formData.celsius}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              step="0.1"
              placeholder="e.g., 25.5"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`mt-6 w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors flex justify-center ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? <ThreeDots /> : "Submit Log"}
        </button>
      </form>
      {success && !loading && (
        <div className="mt-4 text-center text-green-600 text-lg">{success}</div>
      )}
      {error && !loading && (
        <div className="mt-4 text-center text-red-500 text-lg">{error}</div>
      )}
    </div>
  );
};

export default TempLogForm;