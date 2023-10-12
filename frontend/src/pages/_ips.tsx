import { useEffect, useState } from 'react'

type IPResponse = {
  ip: string
  isLoading: boolean
  error?: boolean
}

async function fetchIP(
  whichIP: 'public' | 'local' = 'local'
): Promise<IPResponse> {
  try {
    const response = await fetch('/api/ip', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-which-ip': whichIP,
      },
    })
    if (!response.ok) {
      console.error('Error fetching IP')
      return {
        ip: '',
        isLoading: false,
        error: true,
      }
    }
    const data = await response.json()
    return {
      ip: data.ip,
      isLoading: false,
    }
  } catch (error) {
    console.error(error)
    return {
      ip: '',
      isLoading: false,
      error: true,
    }
  }
}

export default function IPs() {
  const [publicIP, setPublicIP] = useState<IPResponse>({
    ip: '',
    isLoading: true,
  })
  const [localIP, setLocalIP] = useState<IPResponse>({
    ip: '',
    isLoading: true,
  })

  const [counter, setCounter] = useState(0)

  const refetchIP = async (whichIP: 'public' | 'local' = 'local') => {
    if (whichIP === 'public') {
      setPublicIP(await fetchIP('public'))
      return
    }
    setLocalIP(await fetchIP())
  }

  useEffect(() => {
    const boilerplate = async () => {
      const publicIP = await fetchIP('public')
      setPublicIP(publicIP)
      const localIP = await fetchIP()
      setLocalIP(localIP)
    }
    boilerplate()
  }, [])

  return (
    <>
      {publicIP.isLoading ? (
        <p>Public IP: Fetching...</p>
      ) : publicIP.error ? (
        <div className="fetch-error">
          <p>Public IP: Error</p>
          <button type="button" onClick={() => refetchIP('public')}>
            <i className="bi bi-arrow-clockwise"></i>
          </button>
        </div>
      ) : (
        <p>
          Public IP: <span className="text-bold">{publicIP.ip}</span>
        </p>
      )}

      {localIP.isLoading ? (
        <p>Local IP: Fetching...</p>
      ) : localIP.error ? (
        <div className="fetch-error">
          <p>Local IP: Error</p>
          <button type="button" onClick={() => refetchIP()}>
            <i className="bi bi-arrow-clockwise"></i>
          </button>
        </div>
      ) : (
        <p>
          Local IP:{' '}
          <span className="text-bold">{localIP.ip.split(':').pop()}</span>
        </p>
      )}
    </>
  )
}
