const express = require('express');
const router = express.Router();
const FlightRadarService = require('../services/flightRadarService');

const flightService = new FlightRadarService(process.env.NODE_ENV !== 'production');

router.get('/live', async (req, res) => {
  try {
    const { bounds } = req.query;
    
    if (!bounds) {
      return res.status(400).json({ 
        error: 'Bounds parameter is required. Format: lat1,lat2,lon1,lon2' 
      });
    }
    
    const flightPositions = await flightService.getLiveFlightPositions(bounds);
    res.json(flightPositions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get('/:flightId', async (req, res) => {
  try {
    const flightId = req.params.flightId;
    const flightDetails = await flightService.getFlightDetails(flightId);
    res.json(flightDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/airlines/:iataCode', async (req, res) => {
  try {
    const iataCode = req.params.iataCode;
    const airlineInfo = await flightService.getAirlineInfo(iataCode);
    res.json(airlineInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/airports/:iataCode', async (req, res) => {
  try {
    const iataCode = req.params.iataCode;
    const airportInfo = await flightService.getAirportInfo(iataCode);
    res.json(airportInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/search/flights', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ 
        error: 'Search query parameter is required' 
      });
    }
    
    const results = await flightService.searchFlights(query);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;