import { useAuth } from '../hooks/useAuth'

export default function HomePage() {
  const { user } = useAuth()

  return (
    <div className="px-4 pt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-lapochka-dark">
            Привет, {user?.first_name ?? 'Лапочка'}! 👋
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Что пробуем сегодня?</p>
        </div>
        <div className="bg-lapochka-yellow rounded-2xl px-3 py-2 text-center">
          <div className="text-xl font-extrabold text-lapochka-dark">{user?.lapochki ?? 0}</div>
          <div className="text-xs font-semibold text-lapochka-dark">🐾 очков</div>
        </div>
      </div>

      <div className="bg-lapochka-yellow rounded-3xl p-5 mb-4">
        <h2 className="text-lg font-extrabold text-lapochka-dark mb-1">Найди новый вкус</h2>
        <p className="text-sm text-lapochka-dark/70 mb-4">Попробуй лимонад и отметь в коллекции</p>
        <button className="bg-lapochka-dark text-white font-bold rounded-2xl px-5 py-2.5 text-sm">
          Добавить вкус
        </button>
      </div>

      <div className="bg-white rounded-3xl p-5">
        <h2 className="text-base font-extrabold text-lapochka-dark mb-3">Недавно попробовали</h2>
        <p className="text-sm text-gray-400">Пока пусто — будь первым! 🍋</p>
      </div>
    </div>
  )
}
