function getOS() {
  let userAgent = navigator.userAgent
  if (/windows phone/i.test(userAgent)) {
    return 'Windows Phone'
  } else if (/android/i.test(userAgent)) {
    return 'Android'
  } else if (/iPad|iPhone|iPod/.test(userAgent)) {
    return 'iOS'
  } else if (/Macintosh|MacIntel|MacPPC|Mac68K/i.test(userAgent)) {
    return 'macOS'
  } else if (/Windows|Win16|Win32|WinCE|Win64/i.test(userAgent)) {
    return 'Windows'
  } else if (/Linux/i.test(userAgent)) {
    return 'Linux'
  } else {
    return 'Unknown OS'
  }
}

export const os = getOS()

export const isAppleOs = ['macOS', 'iOS'].includes(os)
