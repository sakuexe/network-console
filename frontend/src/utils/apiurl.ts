export default function getApiUrl() {
  const isDev = import.meta.env.DEV
  const prodUrl = process.env.API_URL
  return isDev
    ? 'http://localhost:5000'
    : prodUrl || 'no env variable set (API_URL)'
}
