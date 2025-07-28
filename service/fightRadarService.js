const axios = require('axios');
require('dotenv').config();

const BASE_URL = process.env.FR24_BASE_URL;

class FlightRadarService {
  constructor(useSandbox = true) {
    this.apiKey = useSandbox 
      ? process.env.FR24_API_KEY_SANDBOX 
      : process.env.FR24_API_KEY_REAL;
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
        if (error.response.status === 401) {
          throw new Error('Unauthorized: Invalid API token');
        } else if (error.response.status === 402) {
          throw new Error('Insufficient credits: Please top up your account');
        } else if (error.response.status === 404) {
          throw new Error('Resource not found');
        }
      }
      
      throw new Error('Failed to fetch data from Flightradar24 API');
    }
  }

  async getLiveFlightPositions(bounds) {
    return this.makeRequest('/live/flight-positions/light', { bounds });
  }

  async getFlightDetails(flightId) {
    return this.makeRequest(`/live/flight/${flightId}/light`);
  }

  async getAirlineInfo(iataCode) {
    return this.makeRequest(`/static/airlines/${iataCode}/light`);
  }

  async getAirportInfo(iataCode) {
    return this.makeRequest(`/static/airports/${iataCode}/light`);
  }

  async searchFlights(query) {
    return this.makeRequest('/search/flights', { query });
  }
}

module.exports = FlightRadarService;