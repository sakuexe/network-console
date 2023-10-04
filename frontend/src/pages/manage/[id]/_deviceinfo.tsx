import type { Device } from '../../_devices.astro'

export default function DeviceInfo({ device }: { device: Device }) {
  return (
    <section>
      <h2>Device: {device.id}</h2>
      <p>Device name: {device.name}</p>
    </section>
  )
}
