import getApiUrl from '../../utils/apiurl'

type DeviceRequest = {
  request: Request
}

export async function GET(props: DeviceRequest) {
  // if user goes to /ip/public, return public ip
  // if user goes to /ip, return local ip
  const isPublic = props.request.headers.get('x-which-ip') === 'public'
  const url = isPublic
    ? 'https://api.ipify.org?format=json'
    : `${getApiUrl()}/ip`

  let ip
  try {
    ip = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json())
  } catch (error) {
    console.error(error)
    return new Response(null, {
      status: 404,
      statusText: "Couldn't connect to the server",
    })
  }

  return new Response(JSON.stringify(ip))
}
