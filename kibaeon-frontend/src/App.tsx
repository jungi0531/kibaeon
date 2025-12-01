import { Routes, Route, Navigate } from "react-router-dom"
import './App.css'
import RegisterPage from "./pages/RegisterPage"
import LoginPage from './pages/LoginPage'
import LobbyPage from "./pages/LobbyPage"
import RequireAuth from "./components/RequireAuth"

function App() {

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<RequireAuth />}>
        <Route path="/lobby" element={<LobbyPage />} />
      </Route>
    </Routes>
  )
}

export default App
