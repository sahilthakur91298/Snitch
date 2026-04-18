import { Link } from 'react-router-dom'
import './App.css'

const App = () => {
  return (
    <div className="min-h-screen bg-[#0e0c08] flex flex-col items-center justify-center px-4 py-16">
      <h1 className="text-4xl font-bold tracking-[-0.03em] uppercase text-[#d4a017] mb-8">
        Snitch Home
      </h1>
      <div className="flex gap-4">
        <Link 
          to="/register" 
          className="bg-[#d4a017] text-[#0e0c08] border border-[#d4a017] px-6 py-3 uppercase tracking-[0.2em] font-bold hover:bg-[#e8b520] transition-colors"
        >
          Go to Register
        </Link>
        <Link 
          to="/login" 
          className="bg-transparent text-[#d4a017] border border-[#d4a017] px-6 py-3 uppercase tracking-[0.2em] font-bold hover:bg-[#1a160d] transition-colors"
        >
          Go to Login
        </Link>
      </div>
    </div>
  )
}

export default App