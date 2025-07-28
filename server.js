require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

const cors = require('cors');
app.use(cors({
  origin: '*', 
  methods: ['GET'],
  allowedHeaders: ['Accept', 'Accept-Version', 'Authorization']
}));
app.use(express.json());

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