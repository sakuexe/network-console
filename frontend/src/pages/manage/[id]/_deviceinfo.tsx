import { useState, type ChangeEventHandler, type FormEvent } from 'react'
import type { Device } from '../../_devices.astro'

type DeviceInfoProps = {
  device: Device
  apiUrl: string
}

export default function DeviceInfo(props: DeviceInfoProps) {
  const { device, apiUrl } = props

  const [formData, setFormData] = useState(device)
  const [status, setStatus] = useState('')

  function handleOnChange(target: HTMLInputElement | HTMLTextAreaElement) {
    setFormData({
      ...formData,
      [target.name]: target.value,
    })
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(JSON.stringify(formData))
    try {
      const res = await fetch(`${apiUrl}/devices/${device.id}`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (res.ok) {
        const data = await res.json()
        setStatus(data.message)
      }
    } catch (e) {
      console.error('An error occurred', e)
    }
  }

  return (
    <form
      action={`${apiUrl}/devices/${device.id}`}
      method="POST"
      onSubmit={handleSubmit}
    >
      <output>
        {status && <p className={status ? 'success' : 'error'}>{status}</p>}
      </output>

      <div>
        <label htmlFor="type">Type:</label>
        <input
          type="text"
          id="type"
          name="type"
          defaultValue={formData.type}
          onChange={(event) => handleOnChange(event.target)}
        />
      </div>

      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={formData.name}
          onChange={(event) => handleOnChange(event.target)}
        />
      </div>

      <div>
        <label htmlFor="model">Model:</label>
        <input
          type="text"
          id="model"
          name="model"
          defaultValue={formData.model}
          onChange={(event) => handleOnChange(event.target)}
        />
      </div>

      <div>
        <label htmlFor="ip_address">IP Address:</label>
        <input
          type="text"
          id="ip_address"
          name="ip_address"
          defaultValue={formData.ip_address}
          onChange={(event) => handleOnChange(event.target)}
        />
      </div>

      <div>
        <label htmlFor="url">URL:</label>
        <input
          type="text"
          id="url"
          name="url"
          defaultValue={formData.url}
          onChange={(event) => handleOnChange(event.target)}
        />
      </div>

      <div>
        <label htmlFor="notes">Notes:</label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          defaultValue={formData.notes}
          onChange={(event) => handleOnChange(event.target)}
        ></textarea>
      </div>
      <div className="buttons">
        <a href="/">Return</a>
        <button type="submit">Submit Changes</button>
      </div>
    </form>
  )
}
