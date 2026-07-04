export default function MapPage() {
  return (
    <div className="px-4 pt-6">
      <h1 className="text-2xl font-extrabold mb-1">Карта</h1>
      <p className="text-sm text-gray-500 mb-6">Где купить Лапочку рядом с тобой</p>
      <div className="bg-lapochka-yellow/30 rounded-3xl flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-5xl mb-3">📍</div>
          <p className="text-sm text-gray-500 font-medium">Карта появится совсем скоро</p>
        </div>
      </div>
    </div>
  )
}
