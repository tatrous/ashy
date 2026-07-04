import { useAuth } from '../hooks/useAuth'

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <div className="px-4 pt-6">
      <h1 className="text-2xl font-extrabold mb-6">Профиль</h1>
      <div className="bg-white rounded-3xl p-5 flex items-center gap-4 mb-4">
        {user?.photo_url ? (
          <img src={user.photo_url} className="w-14 h-14 rounded-full" alt="avatar" />
        ) : (
          <div className="w-14 h-14 rounded-full bg-lapochka-yellow flex items-center justify-center text-2xl font-extrabold text-lapochka-dark">
            {user?.first_name?.[0] ?? '?'}
          </div>
        )}
        <div>
          <p className="font-extrabold text-lapochka-dark text-lg">{user?.first_name}</p>
          {user?.username && <p className="text-sm text-gray-400">@{user.username}</p>}
        </div>
      </div>

      <div className="bg-lapochka-yellow rounded-3xl p-5 flex items-center justify-between">
        <div>
          <p className="text-sm text-lapochka-dark/70 font-semibold">Мои очки</p>
          <p className="text-3xl font-extrabold text-lapochka-dark">{user?.lapochki ?? 0}</p>
        </div>
        <span className="text-5xl">🐾</span>
      </div>
    </div>
  )
}
