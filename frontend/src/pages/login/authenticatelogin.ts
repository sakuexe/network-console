type AuthResponse = {
  success: boolean
  message: string
}

export default async function authenticateLogin(
  username: string,
  password: string,
  API_URL: string
): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
    return await response.json()
  } catch (error) {
    return { success: false, message: 'Error contacting the server' }
  }
}
