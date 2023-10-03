export default async function formPost(API_URL: string, event: SubmitEvent) {
  console.log('here')
  const formData = new FormData(event.target as HTMLFormElement)
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
    })
    if (!response.ok) {
      // handle a bad response
      return 'Bad response.'
    }
    // handle a successful response
    const data = await response.json()
    if (data.body.error) {
      // handle an error response
      return data.body.message
    }
  } catch (err) {
    // handle an unexpected error
    console.error(err)
    return 'Unexpected error occurred.'
  }
  return 'Logged in, redirecting...'
}
