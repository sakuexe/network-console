export default function getApiUrl() {
  const isDev = import.meta.env.DEV
  const port = process.env.API_PORT || 5000
  const prodUrl = `${process.env.API_URL}:${port}`
  return isDev
    ? `http://localhost:${port}}`
    : prodUrl || 'no env variable set for API_URL'
}
