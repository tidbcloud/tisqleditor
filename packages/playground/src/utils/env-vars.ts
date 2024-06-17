const keyPrefix = (import.meta.env.VITE_STORAGE_KEY_PREFIX ?? 'v1') + '.'

export function getLocalStorageItem(key: string) {
  return localStorage.getItem(keyPrefix + key)
}

export function setLocalStorageItem(key: string, val: string) {
  localStorage.setItem(keyPrefix + key, val)
}

export function removeLocalStorageItem(key: string) {
  localStorage.removeItem(keyPrefix + key)
}
