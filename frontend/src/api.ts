const BASE_URL = process.env.REACT_APP_API_URL

const request = async (url: string, config: RequestInit) => {
  try {
    const response = await fetch(`${BASE_URL}${url}`, config)

    if (response.status === 500) {
      const data = await response.json()

      // an unknow error occurred internally in the API so let's throw it
      throw new Error(data.message as string)
    }

    return response
  } catch (error) {
    if (error instanceof TypeError) {
      console.error(error)

      // an unknown error occurred when trying to fetch from the API so let's rethrow it with a friendlier message
      throw new Error("An unknown error has occurred.")
    }

    // just rethrow the error that occurred internally in the API
    throw error
  }
}

const api = {
  get: async (url: string, token: string) => {
    const response = await request(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return response
  },

  post: async (url: string, payload: any, token = "") => {
    const response = await request(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    return response
  },

  put: async (url: string, payload: any, token: string) => {
    const response = await request(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    return response
  },

  delete: async (url: string, token: string) => {
    const response = await request(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return response
  },
}

export default api
