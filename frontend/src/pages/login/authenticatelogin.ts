import getApiUrl from '../../utils/apiurl'

type AuthResponse = {
  success: boolean
  message: string
}

export default async function authenticateLogin(
  username: string,
  password: string,
  apiUrl: string = getApiUrl()
): Promise<AuthResponse> {
  try {
    const response = await fetch(`${apiUrl}/login`, {
      method: 'POST',
      body: JSON.stringify({
        username: username,
        password: password,
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': `*`,
      },
    })
    return await response.json()
  } catch (error) {
    return { success: false, message: 'Error contacting the server' }
  }
}
