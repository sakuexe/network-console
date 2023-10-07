import { useState, useEffect } from 'react'
import DeviceInfo from './_deviceinfo'
import type { Device } from '../../_devices.astro'
import '../_manage.css'

type DeviceProps = {
  deviceId: number
  apiUrl: string
}

export default function ManagementConsole(props: DeviceProps) {
  const [device, setDevice] = useState<Device>(null)
  const [isLoading, setIsLoading] = useState(true)

  const { deviceId, apiUrl } = props

  useEffect(() => {
    fetchDevice(deviceId)
      .then((device) => setDevice(device))
      .then(() => console.log(device))
      .finally(() => setIsLoading(false))
  }, [deviceId, apiUrl])

  return (
    <main>
      {device ? (
        <>
          <header>
            <h2 className="capitalize text-center">{device.name}</h2>
            <p className="text-center">{device.model}</p>
          </header>
          <DeviceInfo device={device} apiUrl={apiUrl} />
        </>
      ) : isLoading ? (
        <p>Loading...</p>
      ) : (
        <p>Device not found. Try fetching again</p>
      )}
    </main>
  )
}

async function fetchDevice(deviceId: number) {
  let device: Device
  try {
    const response = await fetch(`/api/${deviceId}`)
    device = await response.json()
  } catch (error) {
    console.error(error)
  }
  return device
}
