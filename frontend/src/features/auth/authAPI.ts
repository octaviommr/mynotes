import api from "../../api"

const API_ENDPOINT = `/auth`

const login = async (email: string, password: string) => {
  const response = await api.post(`${API_ENDPOINT}/login`, { email, password })

  return response
}

const signup = async (email: string, username: string, password: string) => {
  const response = await api.post(`${API_ENDPOINT}/signup`, {
    email,
    username,
    password,
  })

  return response
}

const authAPI = { login, signup }

export default authAPI
