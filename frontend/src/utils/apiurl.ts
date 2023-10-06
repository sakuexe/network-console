export default function getApiUrl() {
  const isDev = import.meta.env.DEV
  return isDev ? 'http://localhost:5000' : import.meta.env.API_URL
}
