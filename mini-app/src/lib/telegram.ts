declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initData: string
        initDataUnsafe: {
          user?: {
            id: number
            first_name: string
            last_name?: string
            username?: string
            photo_url?: string
          }
        }
        expand: () => void
        BackButton: {
          show: () => void
          hide: () => void
          onClick: (fn: () => void) => void
        }
        themeParams: {
          bg_color?: string
          text_color?: string
        }
        ready: () => void
      }
    }
  }
}

function getWebApp() {
  return typeof window !== 'undefined' ? window.Telegram?.WebApp : undefined
}

export function getTelegramUser() {
  return getWebApp()?.initDataUnsafe?.user ?? null
}

export function expandApp() {
  getWebApp()?.expand()
}

export function markReady() {
  getWebApp()?.ready()
}
