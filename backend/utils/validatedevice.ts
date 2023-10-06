type Device = {
  id: number;
  type: string;
  ip_address: string;
  name: string;
  model?: string;
  url?: string;
  notes?: string;
};

export default function validateDevice(form: unknown): boolean {
  const device = form as Device;
  if (!device.type) {
    return false;
  }
  if (!device.ip_address) {
    return false;
  }
  if (!device.name) {
    return false;
  }
  const ipRegex = "^((25[0-5]|(2[0-4]|1d|[1-9]|)d).?\b){4}$";
  if (device.ip_address.match(ipRegex)) {
    return false;
  }
  const urlRegex = "^(http|https)://.*";
  if (device.url && device.url.search(urlRegex)) {
    return false;
  }
  return true;
}
