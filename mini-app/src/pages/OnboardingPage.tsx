import { useAuth } from '../hooks/useAuth'

export default function OnboardingPage() {
  const { error } = useAuth()
  const tg = typeof window !== 'undefined' ? window.Telegram?.WebApp : undefined
  const tgUser = tg?.initDataUnsafe?.user

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-lapochka-cream px-6 text-center">
      <div className="text-7xl mb-6">🐾</div>
      <h1 className="text-3xl font-extrabold text-lapochka-dark mb-3">
        Привет, Лапочка!
      </h1>
      <p className="text-gray-500 text-base mb-8">
        Открывай новые вкусы, собирай коллекцию и влияй на бренд
      </p>
      <p className="text-sm text-gray-400 mb-6">
        Открой приложение через Telegram, чтобы войти
      </p>
      <div className="bg-white/70 rounded-2xl p-4 text-left text-xs text-gray-500 w-full max-w-sm">
        <p>WebApp: {tg ? '✅' : '❌'}</p>
        <p>user: {tgUser ? `✅ ${tgUser.first_name}` : '❌ null'}</p>
        <p>supabase: {error ? `❌ ${error}` : '⏳'}</p>
      </div>
    </div>
  )
}
