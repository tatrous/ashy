import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { getTelegramUser } from '../lib/telegram'

export type AppUser = {
  id: string
  telegram_id: number
  first_name: string
  username: string | null
  photo_url: string | null
  lapochki: number
}

export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      // Give Telegram WebApp script time to inject initData
      await new Promise((r) => setTimeout(r, 300))
      const tgUser = getTelegramUser()
      if (!tgUser) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('users')
        .upsert(
          {
            telegram_id: tgUser.id,
            first_name: tgUser.first_name,
            username: tgUser.username ?? null,
            photo_url: tgUser.photo_url ?? null,
          },
          { onConflict: 'telegram_id' }
        )
        .select()
        .single()

      if (!error && data) {
        setUser(data as AppUser)
      }
      setLoading(false)
    }

    init()
  }, [])

  return { user, loading }
}
