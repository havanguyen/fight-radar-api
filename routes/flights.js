const express = require('express');
const router = express.Router();
const FlightRadarService = require('../services/flightRadarService');

// Khởi tạo FlightRadarService với chế độ sandbox nếu không phải production
const flightService = new FlightRadarService();

// GET /api/static/airlines/{icao}/light
router.get('/static/airlines/:icao/light', async (req, res) => {
  console.log(`[DEBUG] Handling GET /api/static/airlines/${req.params.icao}/light`);
  try {
    const icao = req.params.icao;
    console.log(`[DEBUG] ICAO code received: ${icao}`);
    if (!icao || !/^[A-Z0-9]{3}$/.test(icao)) {
      console.log(`[DEBUG] Validation failed for ICAO: ${icao}`);
      return res.status(400).json({
        error: 'Validation failed',
        details: 'The icao is not a valid ICAO code.'
      });
    }
    const airlineInfo = await flightService.getAirlineInfo(icao);
    console.log(`[DEBUG] Airline info retrieved: ${JSON.stringify(airlineInfo)}`);
    res.json(airlineInfo);
  } catch (error) {
    console.error(`[ERROR] Failed to get airline info for ${icao}: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/static/airports/{code}/light
router.get('/static/airports/:code/light', async (req, res) => {
  console.log(`[DEBUG] Handling GET /api/static/airports/${req.params.code}/light`);
  try {
    const code = req.params.code;
    console.log(`[DEBUG] Airport code received: ${code}`);
    if (!code || !/^[A-Z0-9]{3,4}$/.test(code)) {
      console.log(`[DEBUG] Validation failed for airport code: ${code}`);
      return res.status(400).json({
        error: 'Validation error',
        details: 'The code is not a valid IATA or ICAO code.'
      });
    }
    const airportInfo = await flightService.getAirportInfoLight(code);
    console.log(`[DEBUG] Airport light info retrieved: ${JSON.stringify(airportInfo)}`);
    res.json(airportInfo);
  } catch (error) {
    console.error(`[ERROR] Failed to get airport light info for ${code}: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/static/airports/{code}/full
router.get('/static/airports/:code/full', async (req, res) => {
  console.log(`[DEBUG] Handling GET /api/static/airports/${req.params.code}/full`);
  try {
    const code = req.params.code;
    console.log(`[DEBUG] Airport code received: ${code}`);
    if (!code || !/^[A-Z0-9]{3,4}$/.test(code)) {
      console.log(`[DEBUG] Validation failed for airport code: ${code}`);
      return res.status(400).json({
        error: 'Validation error',
        details: 'The code is not a valid IATA or ICAO code.'
      });
    }
    const airportInfo = await flightService.getAirportInfoFull(code);
    console.log(`[DEBUG] Airport full info retrieved: ${JSON.stringify(airportInfo)}`);
    res.json(airportInfo);
  } catch (error) {
    console.error(`[ERROR] Failed to get airport full info for ${code}: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/live/flight-positions/light
router.get('/live/flight-positions/light', async (req, res) => {
  console.log(`[DEBUG] Handling GET /api/live/flight-positions/light with query: ${JSON.stringify(req.query)}`);
  try {
    const { bounds, flights, callsigns, registrations, painted_as, operating_as, airports, routes, aircraft, altitude_ranges, squawks, categories, data_sources, gspeed, limit } = req.query;
    if (!bounds && !flights && !callsigns && !registrations && !painted_as && !operating_as && !airports && !routes && !aircraft && !altitude_ranges && !squawks && !categories && !data_sources && !gspeed) {
      console.log(`[DEBUG] Validation failed: No query parameters provided`);
      return res.status(400).json({
        error: 'Validation error',
        details: 'At least one query parameter is required.'
      });
    }
    const flightPositions = await flightService.getLiveFlightPositionsLight({
      bounds, flights, callsigns, registrations, painted_as, operating_as, airports, routes, aircraft, altitude_ranges, squawks, categories, data_sources, gspeed, limit
    });
    console.log(`[DEBUG] Live flight positions light retrieved: ${JSON.stringify(flightPositions).slice(0, 200)}...`);
    res.json(flightPositions);
  } catch (error) {
    console.error(`[ERROR] Failed to get live flight positions light: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/live/flight-positions/full
router.get('/live/flight-positions/full', async (req, res) => {
  console.log(`[DEBUG] Handling GET /api/live/flight-positions/full with query: ${JSON.stringify(req.query)}`);
  try {
    const { bounds, flights, callsigns, registrations, painted_as, operating_as, airports, routes, aircraft, altitude_ranges, squawks, categories, data_sources, gspeed, limit } = req.query;
    if (!bounds && !flights && !callsigns && !registrations && !painted_as && !operating_as && !airports && !routes && !aircraft && !altitude_ranges && !squawks && !categories && !data_sources && !gspeed) {
      console.log(`[DEBUG] Validation failed: No query parameters provided`);
      return res.status(400).json({
        error: 'Validation error',
        details: 'At least one query parameter is required.'
      });
    }
    const flightPositions = await flightService.getLiveFlightPositionsFull({
      bounds, flights, callsigns, registrations, painted_as, operating_as, airports, routes, aircraft, altitude_ranges, squawks, categories, data_sources, gspeed, limit
    });
    console.log(`[DEBUG] Live flight positions full retrieved: ${JSON.stringify(flightPositions).slice(0, 200)}...`);
    res.json(flightPositions);
  } catch (error) {
    console.error(`[ERROR] Failed to get live flight positions full: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/live/flight-positions/count
router.get('/live/flight-positions/count', async (req, res) => {
  console.log(`[DEBUG] Handling GET /api/live/flight-positions/count with query: ${JSON.stringify(req.query)}`);
  try {
    const { bounds, flights, callsigns, registrations, painted_as, operating_as, airports, routes, aircraft, altitude_ranges, squawks, categories, data_sources, gspeed } = req.query;
    if (!bounds && !flights && !callsigns && !registrations && !painted_as && !operating_as && !airports && !routes && !aircraft && !altitude_ranges && !squawks && !categories && !data_sources && !gspeed) {
      console.log(`[DEBUG] Validation failed: No query parameters provided`);
      return res.status(400).json({
        error: 'Validation error',
        details: 'At least one query parameter is required.'
      });
    }
    const count = await flightService.getLiveFlightPositionsCount({
      bounds, flights, callsigns, registrations, painted_as, operating_as, airports, routes, aircraft, altitude_ranges, squawks, categories, data_sources, gspeed
    });
    console.log(`[DEBUG] Live flight positions count retrieved: ${count}`);
    res.json(count);
  } catch (error) {
    console.error(`[ERROR] Failed to get live flight positions count: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/historic/flight-positions/full
router.get('/historic/flight-positions/full', async (req, res) => {
  console.log(`[DEBUG] Handling GET /api/historic/flight-positions/full with query: ${JSON.stringify(req.query)}`);
  try {
    const { timestamp, bounds, flights, callsigns, registrations, painted_as, operating_as, airports, routes, aircraft, altitude_ranges, squawks, categories, data_sources, gspeed, limit } = req.query;
    if (!timestamp) {
      console.log(`[DEBUG] Validation failed: Timestamp is missing`);
      return res.status(400).json({
        error: 'Validation error',
        details: 'Timestamp is required.'
      });
    }
    if (!bounds && !flights && !callsigns && !registrations && !painted_as && !operating_as && !airports && !routes && !aircraft && !altitude_ranges && !squawks && !categories && !data_sources && !gspeed) {
      console.log(`[DEBUG] Validation failed: No query parameters provided`);
      return res.status(400).json({
        error: 'Validation error',
        details: 'At least one query parameter is required.'
      });
    }
    const flightPositions = await flightService.getHistoricFlightPositionsFull({
      timestamp, bounds, flights, callsigns, registrations, painted_as, operating_as, airports, routes, aircraft, altitude_ranges, squawks, categories, data_sources, gspeed, limit
    });
    console.log(`[DEBUG] Historic flight positions full retrieved: ${JSON.stringify(flightPositions).slice(0, 200)}...`);
    res.json(flightPositions);
  } catch (error) {
    console.error(`[ERROR] Failed to get historic flight positions full: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/historic/flight-positions/light
router.get('/historic/flight-positions/light', async (req, res) => {
  console.log(`[DEBUG] Handling GET /api/historic/flight-positions/light with query: ${JSON.stringify(req.query)}`);
  try {
    const { timestamp, bounds, flights, callsigns, registrations, painted_as, operating_as, airports, routes, aircraft, altitude_ranges, squawks, categories, data_sources, gspeed, limit } = req.query;
    if (!timestamp) {
      console.log(`[DEBUG] Validation failed: Timestamp is missing`);
      return res.status(400).json({
        error: 'Validation error',
        details: 'Timestamp is required.'
      });
    }
    if (!bounds && !flights && !callsigns && !registrations && !painted_as && !operating_as && !airports && !routes && !aircraft && !altitude_ranges && !squawks && !categories && !data_sources && !gspeed) {
      console.log(`[DEBUG] Validation failed: No query parameters provided`);
      return res.status(400).json({
        error: 'Validation error',
        details: 'At least one query parameter is required.'
      });
    }
    const flightPositions = await flightService.getHistoricFlightPositionsLight({
      timestamp, bounds, flights, callsigns, registrations, painted_as, operating_as, airports, routes, aircraft, altitude_ranges, squawks, categories, data_sources, gspeed, limit
    });
    console.log(`[DEBUG] Historic flight positions light retrieved: ${JSON.stringify(flightPositions).slice(0, 200)}...`);
    res.json(flightPositions);
  } catch (error) {
    console.error(`[ERROR] Failed to get historic flight positions light: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/historic/flight-positions/count
router.get('/historic/flight-positions/count', async (req, res) => {
  console.log(`[DEBUG] Handling GET /api/historic/flight-positions/count with query: ${JSON.stringify(req.query)}`);
  try {
    const { timestamp, bounds, flights, callsigns, registrations, painted_as, operating_as, airports, routes, aircraft, altitude_ranges, squawks, categories, data_sources, gspeed } = req.query;
    if (!timestamp) {
      console.log(`[DEBUG] Validation failed: Timestamp is missing`);
      return res.status(400).json({
        error: 'Validation error',
        details: 'Timestamp is required.'
      });
    }
    if (!bounds && !flights && !callsigns && !registrations && !painted_as && !operating_as && !airports && !routes && !aircraft && !altitude_ranges && !squawks && !categories && !data_sources && !gspeed) {
      console.log(`[DEBUG] Validation failed: No query parameters provided`);
      return res.status(400).json({
        error: 'Validation error',
        details: 'At least one query parameter is required.'
      });
    }
    const count = await flightService.getHistoricFlightPositionsCount({
      timestamp, bounds, flights, callsigns, registrations, painted_as, operating_as, airports, routes, aircraft, altitude_ranges, squawks, categories, data_sources, gspeed
    });
    console.log(`[DEBUG] Historic flight positions count retrieved: ${count}`);
    res.json(count);
  } catch (error) {
    console.error(`[ERROR] Failed to get historic flight positions count: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/historic/flight-events/full
router.get('/historic/flight-events/full', async (req, res) => {
  console.log(`[DEBUG] Handling GET /api/historic/flight-events/full with query: ${JSON.stringify(req.query)}`);
  try {
    const { flight_ids, event_types } = req.query;
    if (!flight_ids) {
      console.log(`[DEBUG] Validation failed: flight_ids is missing`);
      return res.status(400).json({
        error: 'Validation error',
        details: 'Flight_ids is required.'
      });
    }
    console.log(`[DEBUG] Flight IDs: ${flight_ids}, Event types: ${event_types}`);
    const flightEvents = await flightService.getHistoricFlightEventsFull({ flight_ids, event_types });
    console.log(`[DEBUG] Historic flight events full retrieved: ${JSON.stringify(flightEvents).slice(0, 200)}...`);
    res.json(flightEvents);
  } catch (error) {
    console.error(`[ERROR] Failed to get historic flight events full: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/historic/flight-events/light
router.get('/historic/flight-events/light', async (req, res) => {
  console.log(`[DEBUG] Handling GET /api/historic/flight-events/light with query: ${JSON.stringify(req.query)}`);
  try {
    const { flight_ids, event_types } = req.query;
    if (!flight_ids) {
      console.log(`[DEBUG] Validation failed: flight_ids is missing`);
      return res.status(400).json({
        error: 'Validation error',
        details: 'Flight_ids is required.'
      });
    }
    console.log(`[DEBUG] Flight IDs: ${flight_ids}, Event types: ${event_types}`);
    const flightEvents = await flightService.getHistoricFlightEventsLight({ flight_ids, event_types });
    console.log(`[DEBUG] Historic flight events light retrieved: ${JSON.stringify(flightEvents).slice(0, 200)}...`);
    res.json(flightEvents);
  } catch (error) {
    console.error(`[ERROR] Failed to get historic flight events light: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/flight-summary/full
router.get('/flight-summary/full', async (req, res) => {
  console.log(`[DEBUG] Handling GET /api/flight-summary/full with query: ${JSON.stringify(req.query)}`);
  try {
    const { flight_ids, flight_datetime_from, flight_datetime_to, flights, callsigns, registrations, painted_as, operating_as, airports, routes, aircraft, sort, limit } = req.query;
    if (!flight_ids && (!flight_datetime_from || !flight_datetime_to)) {
      console.log(`[DEBUG] Validation failed: flight_ids or both flight_datetime_from and flight_datetime_to are missing`);
      return res.status(400).json({
        error: 'Validation error',
        details: 'Either flight_ids or both flight_datetime_from and flight_datetime_to are required.'
      });
    }
    if (!flight_ids && !flights && !callsigns && !registrations && !painted_as && !operating_as && !airports && !routes && !aircraft) {
      console.log(`[DEBUG] Validation failed: No query parameters provided`);
      return res.status(400).json({
        error: 'Validation error',
        details: 'At least one of flights, registrations, callsigns, painted_as, operating_as, airports, routes, or aircraft is required.'
      });
    }
    const flightSummary = await flightService.getFlightSummaryFull({
      flight_ids, flight_datetime_from, flight_datetime_to, flights, callsigns, registrations, painted_as, operating_as, airports, routes, aircraft, sort, limit
    });
    console.log(`[DEBUG] Flight summary full retrieved: ${JSON.stringify(flightSummary).slice(0, 200)}...`);
    res.json(flightSummary);
  } catch (error) {
    console.error(`[ERROR] Failed to get flight summary full: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/flight-summary/light
router.get('/flight-summary/light', async (req, res) => {
  console.log(`[DEBUG] Handling GET /api/flight-summary/light with query: ${JSON.stringify(req.query)}`);
  try {
    const { flight_ids, flight_datetime_from, flight_datetime_to, flights, callsigns, registrations, painted_as, operating_as, airports, routes, aircraft, sort, limit } = req.query;
    if (!flight_ids && (!flight_datetime_from || !flight_datetime_to)) {
      console.log(`[DEBUG] Validation failed: flight_ids or both flight_datetime_from and flight_datetime_to are missing`);
      return res.status(400).json({
        error: 'Validation error',
        details: 'Either flight_ids or both flight_datetime_from and flight_datetime_to are required.'
      });
    }
    if (!flight_ids && !flights && !callsigns && !registrations && !painted_as && !operating_as && !airports && !routes && !aircraft) {
      console.log(`[DEBUG] Validation failed: No query parameters provided`);
      return res.status(400).json({
        error: 'Validation error',
        details: 'At least one of flights, registrations, callsigns, painted_as, operating_as, airports, routes, or aircraft is required.'
      });
    }
    const flightSummary = await flightService.getFlightSummaryLight({
      flight_ids, flight_datetime_from, flight_datetime_to, flights, callsigns, registrations, painted_as, operating_as, airports, routes, aircraft, sort, limit
    });
    console.log(`[DEBUG] Flight summary light retrieved: ${JSON.stringify(flightSummary).slice(0, 200)}...`);
    res.json(flightSummary);
  } catch (error) {
    console.error(`[ERROR] Failed to get flight summary light: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/flight-summary/count
router.get('/flight-summary/count', async (req, res) => {
  console.log(`[DEBUG] Handling GET /api/flight-summary/count with query: ${JSON.stringify(req.query)}`);
  try {
    const { flight_ids, flight_datetime_from, flight_datetime_to, flights, callsigns, registrations, painted_as, operating_as, airports, routes, aircraft } = req.query;
    if (!flight_ids && (!flight_datetime_from || !flight_datetime_to)) {
      console.log(`[DEBUG] Validation failed: flight_ids or both flight_datetime_from and flight_datetime_to are missing`);
      return res.status(400).json({
        error: 'Validation error',
        details: 'Either flight_ids or both flight_datetime_from and flight_datetime_to are required.'
      });
    }
    if (!flight_ids && !flights && !callsigns && !registrations && !painted_as && !operating_as && !airports && !routes && !aircraft) {
      console.log(`[DEBUG] Validation failed: No query parameters provided`);
      return res.status(400).json({
        error: 'Validation error',
        details: 'At least one of flights, registrations, callsigns, painted_as, operating_as, airports, routes, or aircraft is required.'
      });
    }
    const count = await flightService.getFlightSummaryCount({
      flight_ids, flight_datetime_from, flight_datetime_to, flights, callsigns, registrations, painted_as, operating_as, airports, routes, aircraft
    });
    console.log(`[DEBUG] Flight summary count retrieved: ${count}`);
    res.json(count);
  } catch (error) {
    console.error(`[ERROR] Failed to get flight summary count: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/flight-tracks
router.get('/flight-tracks', async (req, res) => {
  console.log(`[DEBUG] Handling GET /api/flight-tracks with query: ${JSON.stringify(req.query)}`);
  try {
    const { flight_id } = req.query;
    if (!flight_id) {
      console.log(`[DEBUG] Validation failed: flight_id is missing`);
      return res.status(400).json({
        error: 'Validation error',
        details: 'The flight_id field is required.'
      });
    }
    console.log(`[DEBUG] Flight ID: ${flight_id}`);
    const flightTracks = await flightService.getFlightTracks(flight_id);
    console.log(`[DEBUG] Flight tracks retrieved: ${JSON.stringify(flightTracks).slice(0, 200)}...`);
    res.json(flightTracks);
  } catch (error) {
    console.error(`[ERROR] Failed to get flight tracks: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/usage
router.get('/usage', async (req, res) => {
  console.log(`[DEBUG] Handling GET /api/usage with query: ${JSON.stringify(req.query)}`);
  try {
    const { period } = req.query;
    if (period && !['24h', '7d', '30d', '1y'].includes(period)) {
      console.log(`[DEBUG] Validation failed: Invalid period ${period}`);
      return res.status(400).json({
        error: 'Validation failed',
        details: 'The selected period is invalid.'
      });
    }
    console.log(`[DEBUG] Period: ${period || '24h'}`);
    const usage = await flightService.getApiUsage(period || '24h');
    console.log(`[DEBUG] API usage retrieved: ${JSON.stringify(usage)}`);
    res.json(usage);
  } catch (error) {
    console.error(`[ERROR] Failed to get API usage: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;