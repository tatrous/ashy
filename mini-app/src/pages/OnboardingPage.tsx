export default function OnboardingPage() {
  const tg = typeof window !== 'undefined' ? window.Telegram?.WebApp : undefined
  const user = tg?.initDataUnsafe?.user
  const hasInitData = Boolean(tg?.initData)

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
        <p>initData: {hasInitData ? '✅' : '❌'}</p>
        <p>user: {user ? `✅ ${user.first_name}` : '❌ null'}</p>
      </div>
    </div>
  )
}
