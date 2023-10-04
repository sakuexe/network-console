import getApiUrl from '../../../utils/apiurl.ts'

export default function AddDevice() {
  const params = new URLSearchParams(window.location.search).get('error')
  const apiUrl = getApiUrl()
  return (
    <main>
      {params && (
        <output>
          <p className="error">
            Couldn't add the device. Check the values and try again
          </p>
        </output>
      )}
      <form action={`${apiUrl}/devices/add`} method="POST">
        <div>
          <label htmlFor="type">Type:</label>
          <input type="text" id="type" name="type" />
        </div>

        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" />
        </div>

        <div>
          <label htmlFor="model">Model:</label>
          <input type="text" id="model" name="model" />
        </div>

        <div>
          <label htmlFor="ip_address">IP Address:</label>
          <input type="text" id="ip_address" name="ip_address" />
        </div>

        <div>
          <label htmlFor="url">URL:</label>
          <input type="text" id="url" name="url" />
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
    </main>
  )
}
