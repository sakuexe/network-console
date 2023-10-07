import getApiUrl from '../../utils/apiurl'

type DeviceRequest = {
  params: {
    device_id: string
  }
  request: Request
}

export async function GET(props: DeviceRequest) {
  // using Astro's endpoint for contacting the server
  // this is done so that the server can be contacted from the client
  // without having to worry about CORS and without
  // exposing the server's IP address publically
  //
  // and I also understand at the end of the project,
  // that I could've just built the whole thing in a
  // singular project folder inside of Astro...
  //
  // in my defense, this was the first time working
  // with Astro SSR, haha
  const { device_id } = props.params
  let device
  try {
    device = await fetch(`${getApiUrl()}/devices/${device_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json())
  } catch (error) {
    return new Response(null, {
      status: 404,
      statusText: "Couldn't connect to the server",
    })
  }

  return new Response(JSON.stringify(device))
}
