const express = require('express');
const router = express.Router();
const FlightRadarService = require('../services/flightRadarService');

// Khởi tạo FlightRadarService với chế độ sandbox nếu không phải production
const flightService = new FlightRadarService(process.env.NODE_ENV !== 'production');

// GET /api/static/airlines/{icao}/light
router.get('/static/airlines/:icao/light', async (req, res) => {
  try {
    const icao = req.params.icao;
    if (!icao || !/^[A-Z0-9]{3}$/.test(icao)) {
      return res.status(400).json({
        error: 'Validation failed',
        details: 'The icao is not a valid ICAO code.'
      });
    }
    const airlineInfo = await flightService.getAirlineInfo(icao);
    res.json(airlineInfo);
  } catch (error) {
    const status = error.message.includes('not found') ? 404 : 500;
    res.status(status).json({ error: error.message });
  }
});

// GET /api/static/airports/{code}/light
router.get('/airports/:code/light', async (req, res) => {
  try {
    const code = req.params.code;
    if (!code || !/^[A-Z0-9]{3,4}$/.test(code)) {
      return res.status(400).json({
        error: 'Validation error',
        details: 'The code is not a valid IATA or ICAO code.'
      });
    }
    const airportInfo = await flightService.getAirportInfoLight(code);
    res.json(airportInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/static/airports/{code}/full
router.get('/airports/:code/full', async (req, res) => {
  try {
    const code = req.params.code;
    if (!code || !/^[A-Z0-9]{3,4}$/.test(code)) {
      return res.status(400).json({
        error: 'Validation error',
        details: 'The code is not a valid IATA or ICAO code.'
      });
    }
    const airportInfo = await flightService.getAirportInfoFull(code);
    res.json(airportInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/live/flight-positions/light
router.get('/live/flight-positions/light', async (req, res) => {
  try {
    const { bounds, flights, callsigns, registrations, painted_as, operating_as, airports, routes, aircraft, altitude_ranges, squawks, categories, data_sources, gspeed, limit } = req.query;
    if (!bounds && !flights && !callsigns && !registrations && !painted_as && !operating_as && !airports && !routes && !aircraft && !altitude_ranges && !squawks && !categories && !data_sources && !gspeed) {
      return res.status(400).json({
        error: 'Validation error',
        details: 'At least one query parameter is required.'
      });
    }
    const flightPositions = await flightService.getLiveFlightPositionsLight({
      bounds, flights, callsigns, registrations, painted_as, operating_as, airports, routes, aircraft, altitude_ranges, squawks, categories, data_sources, gspeed, limit
    });
    res.json(flightPositions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/live/flight-positions/full
router.get('/live/flight-positions/full', async (req, res) => {
  try {
    const { bounds, flights, callsigns, registrations, painted_as, operating_as, airports, routes, aircraft, altitude_ranges, squawks, categories, data_sources, gspeed, limit } = req.query;
    if (!bounds && !flights && !callsigns && !registrations && !painted_as && !operating_as && !airports && !routes && !aircraft && !altitude_ranges && !squawks && !categories && !data_sources && !gspeed) {
      return res.status(400).json({
        error: 'Validation error',
        details: 'At least one query parameter is required.'
      });
    }
    const flightPositions = await flightService.getLiveFlightPositionsFull({
      bounds, flights, callsigns, registrations, painted_as, operating_as, airports, routes, aircraft, altitude_ranges, squawks, categories, data_sources, gspeed, limit
    });
    res.json(flightPositions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/live/flight-positions/count
router.get('/live/flight-positions/count', async (req, res) => {
  try {
    const { bounds, flights, callsigns, registrations, painted_as, operating_as, airports, routes, aircraft, altitude_ranges, squawks, categories, data_sources, gspeed } = req.query;
    if (!bounds && !flights && !callsigns && !registrations && !painted_as && !operating_as && !airports && !routes && !aircraft && !altitude_ranges && !squawks && !categories && !data_sources && !gspeed) {
      return res.status(400).json({
        error: 'Validation error',
        details: 'At least one query parameter is required.'
      });
    }
    const count = await flightService.getLiveFlightPositionsCount({
      bounds, flights, callsigns, registrations, painted_as, operating_as, airports, routes, aircraft, altitude_ranges, squawks, categories, data_sources, gspeed
    });
    res.json(count);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/historic/flight-positions/full
router.get('/historic/flight-positions/full', async (req, res) => {
  try {
    const { timestamp, bounds, flights, callsigns, registrations, painted_as, operating_as, airports, routes, aircraft, altitude_ranges, squawks, categories, data_sources, gspeed, limit } = req.query;
    if (!timestamp) {
      return res.status(400).json({
        error: 'Validation error',
        details: 'Timestamp is required.'
      });
    }
    if (!bounds && !flights && !callsigns && !registrations && !painted_as && !operating_as && !airports && !routes && !aircraft && !altitude_ranges && !squawks && !categories && !data_sources && !gspeed) {
      return res.status(400).json({
        error: 'Validation error',
        details: 'At least one query parameter is required.'
      });
    }
    const flightPositions = await flightService.getHistoricFlightPositionsFull({
      timestamp, bounds, flights, callsigns, registrations, painted_as, operating_as, airports, routes, aircraft, altitude_ranges, squawks, categories, data_sources, gspeed, limit
    });
    res.json(flightPositions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/historic/flight-positions/light
router.get('/historic/flight-positions/light', async (req, res) => {
  try {
    const { timestamp, bounds, flights, callsigns, registrations, painted_as, operating_as, airports, routes, aircraft, altitude_ranges, squawks, categories, data_sources, gspeed, limit } = req.query;
    if (!timestamp) {
      return res.status(400).json({
        error: 'Validation error',
        details: 'Timestamp is required.'
      });
    }
    if (!bounds && !flights && !callsigns && !registrations && !painted_as && !operating_as && !airports && !routes && !aircraft && !altitude_ranges && !squawks && !categories && !data_sources && !gspeed) {
      return res.status(400).json({
        error: 'Validation error',
        details: 'At least one query parameter is required.'
      });
    }
    const flightPositions = await flightService.getHistoricFlightPositionsLight({
      timestamp, bounds, flights, callsigns, registrations, painted_as, operating_as, airports, routes, aircraft, altitude_ranges, squawks, categories, data_sources, gspeed, limit
    });
    res.json(flightPositions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/historic/flight-positions/count
router.get('/historic/flight-positions/count', async (req, res) => {
  try {
    const { timestamp, bounds, flights, callsigns, registrations, painted_as, operating_as, airports, routes, aircraft, altitude_ranges, squawks, categories, data_sources, gspeed } = req.query;
    if (!timestamp) {
      return res.status(400).json({
        error: 'Validation error',
        details: 'Timestamp is required.'
      });
    }
    if (!bounds && !flights && !callsigns && !registrations && !painted_as && !operating_as && !airports && !routes && !aircraft && !altitude_ranges && !squawks && !categories && !data_sources && !gspeed) {
      return res.status(400).json({
        error: 'Validation error',
        details: 'At least one query parameter is required.'
      });
    }
    const count = await flightService.getHistoricFlightPositionsCount({
      timestamp, bounds, flights, callsigns, registrations, painted_as, operating_as, airports, routes, aircraft, altitude_ranges, squawks, categories, data_sources, gspeed
    });
    res.json(count);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/historic/flight-events/full
router.get('/historic/flight-events/full', async (req, res) => {
  try {
    const { flight_ids, event_types } = req.query;
    if (!flight_ids) {
      return res.status(400).json({
        error: 'Validation error',
        details: 'Flight_ids is required.'
      });
    }
    const flightEvents = await flightService.getHistoricFlightEventsFull({ flight_ids, event_types });
    res.json(flightEvents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/historic/flight-events/light
router.get('/historic/flight-events/light', async (req, res) => {
  try {
    const { flight_ids, event_types } = req.query;
    if (!flight_ids) {
      return res.status(400).json({
        error: 'Validation error',
        details: 'Flight_ids is required.'
      });
    }
    const flightEvents = await flightService.getHistoricFlightEventsLight({ flight_ids, event_types });
    res.json(flightEvents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/flight-summary/full
router.get('/flight-summary/full', async (req, res) => {
  try {
    const { flight_ids, flight_datetime_from, flight_datetime_to, flights, callsigns, registrations, painted_as, operating_as, airports, routes, aircraft, sort, limit } = req.query;
    if (!flight_ids && (!flight_datetime_from || !flight_datetime_to)) {
      return res.status(400).json({
        error: 'Validation error',
        details: 'Either flight_ids or both flight_datetime_from and flight_datetime_to are required.'
      });
    }
    if (!flight_ids && !flights && !callsigns && !registrations && !painted_as && !operating_as && !airports && !routes && !aircraft) {
      return res.status(400).json({
        error: 'Validation error',
        details: 'At least one of flights, registrations, callsigns, painted_as, operating_as, airports, routes, or aircraft is required.'
      });
    }
    const flightSummary = await flightService.getFlightSummaryFull({
      flight_ids, flight_datetime_from, flight_datetime_to, flights, callsigns, registrations, painted_as, operating_as, airports, routes, aircraft, sort, limit
    });
    res.json(flightSummary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/flight-summary/light
router.get('/flight-summary/light', async (req, res) => {
  try {
    const { flight_ids, flight_datetime_from, flight_datetime_to, flights, callsigns, registrations, painted_as, operating_as, airports, routes, aircraft, sort, limit } = req.query;
    if (!flight_ids && (!flight_datetime_from || !flight_datetime_to)) {
      return res.status(400).json({
        error: 'Validation error',
        details: 'Either flight_ids or both flight_datetime_from and flight_datetime_to are required.'
      });
    }
    if (!flight_ids && !flights && !callsigns && !registrations && !painted_as && !operating_as && !airports && !routes && !aircraft) {
      return res.status(400).json({
        error: 'Validation error',
        details: 'At least one of flights, registrations, callsigns, painted_as, operating_as, airports, routes, or aircraft is required.'
      });
    }
    const flightSummary = await flightService.getFlightSummaryLight({
      flight_ids, flight_datetime_from, flight_datetime_to, flights, callsigns, registrations, painted_as, operating_as, airports, routes, aircraft, sort, limit
    });
    res.json(flightSummary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/flight-summary/count
router.get('/flight-summary/count', async (req, res) => {
  try {
    const { flight_ids, flight_datetime_from, flight_datetime_to, flights, callsigns, registrations, painted_as, operating_as, airports, routes, aircraft } = req.query;
    if (!flight_ids && (!flight_datetime_from || !flight_datetime_to)) {
      return res.status(400).json({
        error: 'Validation error',
        details: 'Either flight_ids or both flight_datetime_from and flight_datetime_to are required.'
      });
    }
    if (!flight_ids && !flights && !callsigns && !registrations && !painted_as && !operating_as && !airports && !routes && !aircraft) {
      return res.status(400).json({
        error: 'Validation error',
        details: 'At least one of flights, registrations, callsigns, painted_as, operating_as, airports, routes, or aircraft is required.'
      });
    }
    const count = await flightService.getFlightSummaryCount({
      flight_ids, flight_datetime_from, flight_datetime_to, flights, callsigns, registrations, painted_as, operating_as, airports, routes, aircraft
    });
    res.json(count);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/flight-tracks
router.get('/flight-tracks', async (req, res) => {
  try {
    const { flight_id } = req.query;
    if (!flight_id) {
      return res.status(400).json({
        error: 'Validation error',
        details: 'The flight_id field is required.'
      });
    }
    const flightTracks = await flightService.getFlightTracks(flight_id);
    res.json(flightTracks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/usage
router.get('/usage', async (req, res) => {
  try {
    const { period } = req.query;
    if (period && !['24h', '7d', '30d', '1y'].includes(period)) {
      return res.status(400).json({
        error: 'Validation failed',
        details: 'The selected period is invalid.'
      });
    }
    const usage = await flightService.getApiUsage(period || '24h');
    res.json(usage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;