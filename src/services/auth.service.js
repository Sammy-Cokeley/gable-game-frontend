import api from './api'

class AuthService {
  async login(email, password) {
    const { data } = await api.post('/api/login', { email, password })

    if (data?.token) {
      localStorage.setItem('user', JSON.stringify({ ...data.user, token: data.token }))
    }
    return data
  }

  logout() {
    localStorage.removeItem('user')
  }

  async register(email, password) {
    return api.post('/api/register', { email, password })
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'))
  }
}

export default new AuthService()