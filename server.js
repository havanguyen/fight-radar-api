require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: '*',
  methods: ['GET'],
  allowedHeaders: ['Accept', 'Accept-Version', 'Authorization']
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Fight Radar API!',
    version: 'v1',
    status: 'Server is running',
    timestamp: new Date().toISOString(),
    baseUrl: process.env.FR24_BASE_URL || 'https://fr24api.flightradar24.com',
    documentation: 'https://github.com/havanguyen/fight-radar-api',
    availableEndpoints: [
      '/api/static/airlines/:icao/light',
      '/api/static/airports/:code/light',
      '/api/static/airports/:code/full',
      '/api/live/flight-positions/light',
      '/api/usage'
    ]
  });
});

const flightRoutes = require('./routes/flights'); 
app.use('/api', flightRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Flightradar API base URL: ${process.env.FR24_BASE_URL}`);
});