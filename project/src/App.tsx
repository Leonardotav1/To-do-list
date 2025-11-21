import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Home } from './pages/HomePage'
import { ThemeProvider } from './components/Theme/theme-provider'

function App() {

  return (
      <ThemeProvider>
        <Home />
      </ThemeProvider>
  )
}

export default App
