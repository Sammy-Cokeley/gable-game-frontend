import axios from 'axios';

const API_BASE_URL = import.meta.env.MODE === 'development'
  ? 'http://localhost:3000'
  : 'https://gable-game-backend.onrender.com'

class AuthService {
  async login(email, password) {
    const response = await axios.post(`${API_BASE_URL}/api/login`, { email, password });
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify({ token: response.data.token }));
    }
    return response.data;
  }

  logout() {
    localStorage.removeItem('user');
  }

  async register(email, password) {
    return axios.post(`${API_BASE_URL}/api/register`, {
      email,
      password
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}

export default new AuthService();