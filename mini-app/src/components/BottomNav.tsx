import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/', icon: '🏠', label: 'Главная' },
  { to: '/collection', icon: '🍋', label: 'Коллекция' },
  { to: '/map', icon: '📍', label: 'Карта' },
  { to: '/profile', icon: '👤', label: 'Профиль' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex z-50">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === '/'}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center py-2 gap-0.5 text-xs font-semibold transition-colors ${
              isActive ? 'text-lapochka-orange' : 'text-gray-400'
            }`
          }
        >
          <span className="text-xl">{tab.icon}</span>
          <span>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
