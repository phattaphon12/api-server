const axios = require("axios");
const express = require("express");
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT;

app.use(express.json());
app.use(cors());

const url = [
  process.env.API_URL_1,
  process.env.API_URL_2,
];

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No Bearer token provided" });
  }

  const token = authHeader.split(" ")[1];

  if (token !== process.env.API_TOKEN) {
    return res.status(403).json({ error: "Forbidden: Invalid token" });
  }

  next();
};

app.get("/", (req, res) => {
  res.send("API is running...");
});


app.get("/configs/:yourDroneId", async (req, res) => {
  const droneId = Number(req.params.yourDroneId);
  try {
    const response = await axios.get(url[0]);
    const data = response.data.data;
    const drone = data.find((d) => d.drone_id === droneId);

    if (drone) {
      const filterDrone = {
        drone_id: drone.drone_id,
        drone_name: drone.drone_name,
        light: drone.light,
        country: drone.country,
        weight: drone.weight
      };
      res.json(filterDrone);
    } else {
      res.status(404).json({ error: "Drone not found" });
    }
  } catch (err) {
    console.error("Error fetching data:", err.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.get("/status/:yourDroneId", async (req, res) => {
  const droneId = Number(req.params.yourDroneId);
  try {
    const response = await axios.get(url[0]);
    const data = response.data.data;
    const status = data.find((d) => d.drone_id === droneId);

    if (status) {
      const filterDrone = {
        condition: status.condition,
      };
      res.json(filterDrone);
    } else {
      res.status(404).json({ error: "Drone not found" });
    }
  } catch (err) {
    console.error("Error fetching data:", err.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.get("/logs/:yourDroneId", async (req, res) => {
  const droneId = Number(req.params.yourDroneId);
  try {
    const response = await axios.get(url[1]);
    const data = response.data.items;

    // Filter logs by droneId
    const logs = data.filter((d) => d.drone_id === droneId);

    // Sort logs by 'created' field (descending: newest to oldest)
    const sortedLogs = logs.sort((a, b) => new Date(b.created) - new Date(a.created));

    // Limit to 25 entries
    const limitedLogs = sortedLogs.slice(0, 25);

    // Map to include only specified fields
    const filteredLogs = limitedLogs.map(log => ({
      drone_id: log.drone_id,
      drone_name: log.drone_name,
      created: log.created,
      country: log.country,
      celsius: log.celsius
    }));

    res.json(filteredLogs);
  } catch (err) {
    console.error("Error fetching data:", err.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.post("/logs", authMiddleware, async (req, res) => {
  try {
    const { drone_id, drone_name, country, celsius } = req.body;

    if (!drone_id || !drone_name || !country || celsius === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const response = await axios.post(url[1], {
      drone_id, drone_name, country, celsius
    }, {
      headers: { Authorization: `Bearer ${process.env.API_TOKEN}` } 
    });

    res.status(201).json(response.data);
  } catch (err) {
    console.error("Error creating log:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to create log", details: err.response?.data || err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;