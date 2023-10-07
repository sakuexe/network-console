import getApiUrl from '../../utils/apiurl'

export async function POST({ request }: { request: Request }) {
  // using Astro's endpoint for contacting the server
  // this is done so that the server can be contacted from the client
  // without having to worry about CORS and without
  // exposing the server's IP address publically
  const formBody = await request.json()

  try {
    const response = await fetch(`${getApiUrl()}/devices/add`, {
      method: 'POST',
      body: JSON.stringify(formBody),
      headers: {
        'Content-Type': 'application/json',
        // 'Access-Control-Allow-Origin': `*`,
      },
    }).then((response) => response.json())

    return new Response(JSON.stringify(response), {
      status: response.success ? 200 : 400,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    const failedResponse = {
      success: false,
      message: 'Error contacting the server',
    }
    return new Response(JSON.stringify(failedResponse), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
