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
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function init() {
      await new Promise((r) => setTimeout(r, 300))
      const tgUser = getTelegramUser()
      if (!tgUser) {
        setError('no_telegram_user')
        setLoading(false)
        return
      }

      const { data, error: sbError } = await supabase
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

      if (sbError) {
        setError(sbError.message)
      } else if (data) {
        setUser(data as AppUser)
      }
      setLoading(false)
    }

    init()
  }, [])

  return { user, loading, error }
}
