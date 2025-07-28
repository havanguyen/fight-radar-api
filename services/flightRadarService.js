const axios = require('axios');
require('dotenv').config();

const BASE_URL = process.env.FR24_BASE_URL;

class FlightRadarService {
  constructor(useSandbox = true) {
    const apiKey = useSandbox ? process.env.FR24_API_KEY_SANDBOX : process.env.FR24_API_KEY_REAL;
    if (!apiKey) {
      throw new Error('Flightradar24 API key not configured');
    }
    const [id, key] = apiKey.split('|');
    this.apiKey = key;
  }

  async makeRequest(endpoint, params = {}) {
    try {
      const response = await axios.get(`${BASE_URL}${endpoint}`, {
        headers: {
          'Accept': 'application/json',
          'Accept-Version': 'v1',
          'Authorization': `Bearer ${this.apiKey}`
        },
        params
      });
      return response.data;
    } catch (error) {
      console.error('FlightRadar API Error:', error.response?.data || error.message);
      
      if (error.response) {
        switch (error.response.status) {
          case 400:
            throw new Error('Bad Request');
          case 401:
            throw new Error('Unauthorized: Invalid API token');
          case 402:
            throw new Error('Forbidden: Insufficient credits');
          case 403:
            throw new Error('Forbidden');
          case 404:
            throw new Error('Resource not found');
          case 429:
            throw new Error('Too Many Requests');
          default:
            throw new Error(`API Error: ${error.response.status}`);
        }
      }
      throw new Error('Network error while contacting Flightradar24 API');
    }
  }

  async getAirlineInfo(icao) {
    return this.makeRequest(`/api/static/airlines/${icao}/light`);
  }

  async getAirportInfoLight(code) {
    return this.makeRequest(`/api/static/airports/${code}/light`);
  }

  async getAirportInfoFull(code) {
    return this.makeRequest(`/api/static/airports/${code}/full`);
  }

  async getLiveFlightPositionsLight(params) {
    return this.makeRequest('/api/live/flight-positions/light', params);
  }

  async getLiveFlightPositionsFull(params) {
    return this.makeRequest('/api/live/flight-positions/full', params);
  }

  async getLiveFlightPositionsCount(params) {
    return this.makeRequest('/api/live/flight-positions/count', params);
  }

  async getHistoricFlightPositionsFull(params) {
    return this.makeRequest('/api/historic/flight-positions/full', params);
  }

  async getHistoricFlightPositionsLight(params) {
    return this.makeRequest('/api/historic/flight-positions/light', params);
  }

  async getHistoricFlightPositionsCount(params) {
    return this.makeRequest('/api/historic/flight-positions/count', params);
  }

  async getHistoricFlightEventsFull(params) {
    return this.makeRequest('/api/historic/flight-events/full', params);
  }

  async getHistoricFlightEventsLight(params) {
    return this.makeRequest('/api/historic/flight-events/light', params);
  }

  async getFlightSummaryFull(params) {
    return this.makeRequest('/api/flight-summary/full', params);
  }

  async getFlightSummaryLight(params) {
    return this.makeRequest('/api/flight-summary/light', params);
  }

  async getFlightSummaryCount(params) {
    return this.makeRequest('/api/flight-summary/count', params);
  }

  async getFlightTracks(flight_id) {
    return this.makeRequest('/api/flight-tracks', { flight_id });
  }

  async getApiUsage(period) {
    return this.makeRequest('/api/usage', { period });
  }
}

module.exports = FlightRadarService;