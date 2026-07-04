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

export const tg = typeof window !== 'undefined' ? window.Telegram?.WebApp : null

export function getTelegramUser() {
  return tg?.initDataUnsafe?.user ?? null
}

export function expandApp() {
  tg?.expand()
}

export function markReady() {
  tg?.ready()
}
