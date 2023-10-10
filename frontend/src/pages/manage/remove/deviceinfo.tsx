import { useState, useEffect } from 'react'

export type Device = {
  id: number
  type: 'router' | 'switch' | string
  ip_address: string
  name: string
  model: string | null
  url: string | null
  last_update: string
  notes: string | null
}

async function fetchDevice(id: string | number, setDevice: Function) {
  try {
    const response = await fetch(`/api/${id}`).then((res) => res.json())
    const last_update = new Date(response.last_update).toLocaleDateString(
      'fi-FI'
    )
    response.last_update = last_update
    setDevice(response)
  } catch (error) {
    console.error(error)
  }
}

type DeviceInfoProps = {
  deviceId: string | number
  isLoggedIn: boolean
}

export default function DeviceInfo(props: DeviceInfoProps) {
  const [device, setDevice] = useState<Device>()
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    // fetch device info on load
    fetchDevice(props.deviceId, setDevice)
    setIsLoading(false)
  }, [])

  // user not logged in
  if (!props.isLoggedIn) {
    return (
      <header>
        <h1>Not logged in</h1>
        <p>
          You are not logged in. Please <a href="/login">log in</a> to remove
          the device.
        </p>
      </header>
    )
  }

  if (isLoading) {
    // loading screen
    return (
      <header>
        <h1>Loading...</h1>
        <p>Fetching device information</p>
      </header>
    )
  }

  if (!device) {
    // device not found
    return (
      <header>
        <h1>Device not found</h1>
        <p>Reload and try again</p>
        <button onClick={() => window.location.reload()}>Reload</button>
      </header>
    )
  }

  // device found
  return (
    <section>
      <header>
        <h1>Remove device?</h1>
        <p className="last-updated">last updated: {device.last_update}</p>
      </header>
      <article>
        <div className="id">
          <p>{device.id}</p>
          <p>
            {device.name} <span>Wlan</span>
          </p>
        </div>
        {device.model && (
          <div>
            <p>Model:</p>
            <p>{device.model}</p>
          </div>
        )}
        <div>
          <p>IP address:</p>
          <p>{device.ip_address}</p>
        </div>
        {device.url && (
          <div className="full">
            <p>URL:</p>
            <p>{device.url}</p>
          </div>
        )}
        {device.notes && (
          <div>
            <p>Notes:</p>
            <p>{device.notes}</p>
          </div>
        )}
        <form onSubmit={(event) => handleSubmit(event, device.id, setMessage)}>
          <button
            type="button"
            onClick={() => {
              window.location.assign('/')
            }}
          >
            Cancel
          </button>
          <button type="submit">Remove</button>
        </form>
      </article>
      {message && <output>{message}</output>}
    </section>
  )
}

async function handleSubmit(
  event: React.FormEvent<HTMLFormElement>,
  id: number,
  setMessage: Function
) {
  event.preventDefault()
  try {
    const response = await fetch(`/api/remove/${id}`).then((res) => res.json())
    if (response.success) {
      setMessage(`${response.message}. Redirecting...`)
      setTimeout(() => {
        window.location.assign('/')
        return
      }, 1000)
    }
  } catch (error) {
    console.error(error)
    setMessage('Internal server error (frontend)')
  }
}
