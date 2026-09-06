import { useEffect, useState } from 'react'
import { WifiOff } from 'lucide-react'

function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine)

  useEffect(() => {
    const goOnline = () => setIsOnline(true)
    const goOffline = () => setIsOnline(false)
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  return isOnline
}

// navigator.onLine only reflects the network interface, not real
// connectivity to our own backend — but it reliably catches the common case
// (device in airplane mode / no signal) with zero cost, so it earns its
// place as a first line of defense before a request even fails.
export function OfflineBanner() {
  const isOnline = useOnlineStatus()

  if (isOnline) return null

  return (
    <div
      role="status"
      className="flex items-center justify-center gap-2 bg-warning-bg text-warning-text text-sm font-medium px-4 py-2 text-center"
    >
      <WifiOff className="w-4 h-4 shrink-0" aria-hidden="true" />
      Você está sem conexão com a internet. Alguns conteúdos podem não carregar.
    </div>
  )
}
