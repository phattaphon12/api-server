const axios = require("axios");
const express = require("express");
const cors = require('cors');
const app = express();

const port = 5000;

app.use(express.json());
app.use(cors());

const url = [
  "https://script.google.com/macros/s/AKfycbzwclqJRodyVjzYyY-NTQDb9cWG6Hoc5vGAABVtr5-jPA_ET_2IasrAJK4aeo5XoONiaA/exec",
  "https://app-tracking.pockethost.io/api/collections/drone_logs/records",
];

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No Bearer token provided" });
  }

  const token = authHeader.split(" ")[1]; // ดึง Token ออกมา

  // ตรวจสอบว่า Token ถูกต้องหรือไม่
  if (token !== "20250301efx") {
    return res.status(403).json({ error: "Forbidden: Invalid token" });
  }

  next(); // ถ้า Token ถูกต้อง ให้ไปทำงานต่อ
};

app.get("/configs/:yourDroneId", async (req, res) => {
  const droneId = Number(req.params.yourDroneId);
  try {
    const response = await axios.get(url[0]);
    const data = response.data.data;
    // res.json(response.data.data);
    const drone = data.find((d) => d.drone_id === droneId);

    // res.json(drone);
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
    // res.json(response.data.data);
    const status = data.find((d) => d.drone_id === droneId);

    // res.json(drone);
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
    const response = await axios.get(url[1]); // url[1] = "https://app-tracking.pockethost.io/api/collections/drone_logs/records"
    const data = response.data.items; // Assuming items is an array of log entries

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

    res.json(filteredLogs); // Send the filtered and sorted JSON array
  } catch (err) {
    console.error("Error fetching data:", err.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// ใช้ Middleware นี้ในทุก API ที่ต้องใช้ Authorization
app.post("/logs", authMiddleware, async (req, res) => {
  try {
    const { drone_id, drone_name, country, celsius } = req.body;

    if (!drone_id || !drone_name || !country || celsius === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const response = await axios.post(url[1], {
      drone_id, drone_name, country, celsius
    }, {
      headers: { Authorization: `Bearer 20250301efx` } // ส่ง Token ไป API ปลายทางด้วย
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
