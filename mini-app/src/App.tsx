import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { expandApp, markReady } from './lib/telegram'
import { useAuth } from './hooks/useAuth'

import HomePage from './pages/HomePage'
import CollectionPage from './pages/CollectionPage'
import MapPage from './pages/MapPage'
import ProfilePage from './pages/ProfilePage'
import OnboardingPage from './pages/OnboardingPage'
import BottomNav from './components/BottomNav'

function AppInner() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-lapochka-cream">
        <div className="text-4xl animate-bounce">🐾</div>
      </div>
    )
  }

  if (!user) {
    return <OnboardingPage />
  }

  return (
    <div className="flex flex-col min-h-screen bg-lapochka-cream">
      <div className="flex-1 overflow-y-auto pb-20">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/collection" element={<CollectionPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <BottomNav />
    </div>
  )
}

export default function App() {
  useEffect(() => {
    expandApp()
    markReady()
  }, [])

  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  )
}
