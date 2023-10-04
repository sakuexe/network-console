export default function getApiUrl() {
  const isDev = import.meta.env.DEV
  const prodApi = `${import.meta.env.API_URL}:${import.meta.env.API_PORT}`
  return isDev ? 'http://localhost:5000' : prodApi
}
