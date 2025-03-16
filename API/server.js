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

app.post("/logs", async (req, res) => {
  try {
    // ✅ req.body ตอนนี้อ่านค่า JSON ได้แล้ว
    const { drone_id, drone_name, country, celsius } = req.body;

    if (!drone_id || !drone_name || !country || celsius === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ✅ ส่งข้อมูลไปยัง Drone Log Server
    const response = await axios.post(url[1], {
      drone_id,
      drone_name,
      country,
      celsius,
    });

    res.status(201).json(response.data);
  } catch (err) {
    console.error("Error creating log:", err.message);
    res.status(500).json({ error: "Failed to create log" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
