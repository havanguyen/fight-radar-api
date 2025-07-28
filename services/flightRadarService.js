const axios = require('axios');
require('dotenv').config();

const BASE_URL = process.env.FR24_BASE_URL;

class FlightRadarService {
  constructor() {
    console.log(`[DEBUG] Initializing FlightRadarService with useSandbox: ${useSandbox}`);
    const apiKey = process.env.FR24_API_KEY_REAL;
    if (!apiKey) {
      console.error('[ERROR] Flightradar24 API key not configured');
      throw new Error('Flightradar24 API key not configured');
    }
    const [id, key] = apiKey.split('|');
    this.apiKey = key;
    console.log(`[DEBUG] API key initialized (ID: ${id}, Key: [HIDDEN])`);
  }

  async makeRequest(endpoint, params = {}) {
    console.log(`[DEBUG] Making request to endpoint: ${endpoint} with params: ${JSON.stringify(params)}`);
    try {
      const response = await axios.get(`${BASE_URL}${endpoint}`, {
        headers: {
          'Accept': 'application/json',
          'Accept-Version': 'v1',
          'Authorization': `Bearer ${this.apiKey}`
        },
        params
      });
      console.log(`[DEBUG] Response received from ${endpoint}: ${JSON.stringify(response.data).slice(0, 200)}...`);
      return response.data;
    } catch (error) {
      console.error(`[ERROR] FlightRadar API Error at ${endpoint}: ${error.message}`);
      if (error.response) {
        console.error(`[ERROR] Response status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}`);
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
      console.error('[ERROR] Network error while contacting Flightradar24 API');
      throw new Error('Network error while contacting Flightradar24 API');
    }
  }

  async getAirlineInfo(icao) {
    console.log(`[DEBUG] Fetching airline info for ICAO: ${icao}`);
    return this.makeRequest(`/api/static/airlines/${icao}/light`);
  }

  async getAirportInfoLight(code) {
    console.log(`[DEBUG] Fetching light airport info for code: ${code}`);
    return this.makeRequest(`/api/static/airports/${code}/light`);
  }

  async getAirportInfoFull(code) {
    console.log(`[DEBUG] Fetching full airport info for code: ${code}`);
    return this.makeRequest(`/api/static/airports/${code}/full`);
  }

  async getLiveFlightPositionsLight(params) {
    console.log(`[DEBUG] Fetching live flight positions light with params: ${JSON.stringify(params)}`);
    return this.makeRequest('/api/live/flight-positions/light', params);
  }

  async getLiveFlightPositionsFull(params) {
    console.log(`[DEBUG] Fetching live flight positions full with params: ${JSON.stringify(params)}`);
    return this.makeRequest('/api/live/flight-positions/full', params);
  }

  async getLiveFlightPositionsCount(params) {
    console.log(`[DEBUG] Fetching live flight positions count with params: ${JSON.stringify(params)}`);
    return this.makeRequest('/api/live/flight-positions/count', params);
  }

  async getHistoricFlightPositionsFull(params) {
    console.log(`[DEBUG] Fetching historic flight positions full with params: ${JSON.stringify(params)}`);
    return this.makeRequest('/api/historic/flight-positions/full', params);
  }

  async getHistoricFlightPositionsLight(params) {
    console.log(`[DEBUG] Fetching historic flight positions light with params: ${JSON.stringify(params)}`);
    return this.makeRequest('/api/historic/flight-positions/light', params);
  }

  async getHistoricFlightPositionsCount(params) {
    console.log(`[DEBUG] Fetching historic flight positions count with params: ${JSON.stringify(params)}`);
    return this.makeRequest('/api/historic/flight-positions/count', params);
  }

  async getHistoricFlightEventsFull(params) {
    console.log(`[DEBUG] Fetching historic flight events full with params: ${JSON.stringify(params)}`);
    return this.makeRequest('/api/historic/flight-events/full', params);
  }

  async getHistoricFlightEventsLight(params) {
    console.log(`[DEBUG] Fetching historic flight events light with params: ${JSON.stringify(params)}`);
    return this.makeRequest('/api/historic/flight-events/light', params);
  }

  async getFlightSummaryFull(params) {
    console.log(`[DEBUG] Fetching flight summary full with params: ${JSON.stringify(params)}`);
    return this.makeRequest('/api/flight-summary/full', params);
  }

  async getFlightSummaryLight(params) {
    console.log(`[DEBUG] Fetching flight summary light with params: ${JSON.stringify(params)}`);
    return this.makeRequest('/api/flight-summary/light', params);
  }

  async getFlightSummaryCount(params) {
    console.log(`[DEBUG] Fetching flight summary count with params: ${JSON.stringify(params)}`);
    return this.makeRequest('/api/flight-summary/count', params);
  }

  async getFlightTracks(flight_id) {
    console.log(`[DEBUG] Fetching flight tracks for flight_id: ${flight_id}`);
    return this.makeRequest('/api/flight-tracks', { flight_id });
  }

  async getApiUsage(period) {
    console.log(`[DEBUG] Fetching API usage for period: ${period}`);
    return this.makeRequest('/api/usage', { period });
  }
}

module.exports = FlightRadarService;