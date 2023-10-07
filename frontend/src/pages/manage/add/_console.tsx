import { useState } from 'react'
import '../_manage.css'

type Response = {
  success: boolean
  message: string
}

async function sendFormData(form: HTMLFormElement): Promise<Response> {
  const formData = Object.fromEntries(new FormData(form))
  try {
    const res = await fetch(`/api/add`, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return await res.json()
  } catch (e) {
    console.error(e)
    return { success: false, message: 'Internal server error (frontend)' }
  }
}

export default function AddDevice() {
  const [status, setStatus] = useState<Response>()

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const res = await sendFormData(event.currentTarget)
    setStatus(res)
  }

  if (status?.success === true) {
    window.location.href = '/'
    return (
      <main className="container">
        <output className="text-center">
          <p>{status?.message || 'Device added succesfully'}</p>
          <p>Redirecting...</p>
        </output>
      </main>
    )
  }

  return (
    <main className="container">
      {status?.success === false && (
        <output>
          <p>
            {status?.message || 'An error occurred. Please try again later.'}
          </p>
        </output>
      )}
      <form onSubmit={handleFormSubmit}>
        <div>
          <label htmlFor="type">
            <abbr title="Required">*</abbr> Type:
          </label>
          <input
            type="text"
            id="type"
            name="type"
            list="device-types"
            required
          />
          <datalist id="device-types">
            <option value="Router" />
            <option value="Switch" />
            <option value="NAS" />
            <option value="ePDU" />
            <option value="Proxmox" />
            <option value="Network console" />
            <option value="Wlan" />
          </datalist>
        </div>

        <div>
          <label htmlFor="name">
            <abbr title="Required">*</abbr> Name/Make/Hostname:
          </label>
          <input type="text" id="name" name="name" required />
        </div>

        <div>
          <label htmlFor="model">Model:</label>
          <input type="text" id="model" name="model" />
        </div>

        <div>
          <label htmlFor="ip_address">
            <abbr title="Required, must be unique">*</abbr> IP Address:
          </label>
          <input
            type="text"
            id="ip_address"
            name="ip_address"
            pattern="^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$"
            required
          />
        </div>

        <div>
          <label htmlFor="url">URL:</label>
          <input
            type="text"
            id="url"
            name="url"
            pattern="^(http|https):\/\/.*"
          />
        </div>

        <div>
          <label htmlFor="notes">Notes:</label>
          <textarea id="notes" name="notes" rows={4}></textarea>
        </div>
        <div className="buttons">
          <a href="/">Return</a>
          <button type="submit">Submit Changes</button>
        </div>
      </form>
      <p className="secondary">* Required</p>
    </main>
  )
}
