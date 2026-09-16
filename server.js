const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let telemetryHistory = [];
let latestData = { temperature: null, humidity: null, updatedAt: null };

app.post('/api/data', (req, res) => {
    const { temperature, humidity } = req.body;
    if (temperature === undefined || humidity === undefined) {
        return res.status(400).json({ status: "error", message: "Missing data" });
    }
    latestData = {
        temperature: Number(temperature),
        humidity: Number(humidity),
        updatedAt: new Date().toISOString()
    };
    telemetryHistory.push({...latestData});
    if (telemetryHistory.length > 50) telemetryHistory.shift();
    console.log("Получены данные от ESP32:", latestData);
    res.json({ status: "ok", message: "Data received" });
});

app.get('/api/data', (req, res) => {
    res.json({ latest: latestData, history: telemetryHistory });
});

app.get('/', (req, res) => {
    res.send('Мой личный блекджек-сервер работает! 🚀');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
