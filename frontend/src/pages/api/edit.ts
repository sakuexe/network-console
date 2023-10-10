import getApiUrl from '../../utils/apiurl'

type APIResponse = {
  message: string
  error?: string
}

type Device = {
  id: number
  type: 'router' | 'switch' | string
  ip_address: string
  name: string
  model: string | null
  url: string | null
  last_update: string
  notes: string | null
}

export async function POST({ request }: { request: Request }) {
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
  const formData: Device = await request.json()
  let apiResponse: APIResponse
  try {
    apiResponse = await fetch(`${getApiUrl()}/devices/${formData.id}`, {
      method: 'POST',
      body: JSON.stringify(formData),
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

  if (apiResponse.error) console.error(apiResponse.error)
  return new Response(JSON.stringify(apiResponse))
}
